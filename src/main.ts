import type { ConfigKeyPaths } from './config'
import cluster from 'node:cluster'

import path from 'node:path'
import {
  HttpStatus,
  Logger,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'

import { NestNodeApplication } from '@nestjs/platform-node'

import { useContainer } from 'class-validator'

import { AppModule } from './app.module'
import { BODY_PARSER_LIMIT, nodeAdapter } from './common/adapters/node.adapter'
import { RedisIoAdapter } from './common/adapters/socket.adapter'
import { LoggingInterceptor } from './common/interceptors/logging.interceptor'
import { isDev, isMainProcess } from './global/env'
import { setupSwagger } from './setup-swagger'
import { LoggerService } from './shared/logger/logger.service'

declare const module: any

async function bootstrap() {
  const app = await NestFactory.create<NestNodeApplication>(
    AppModule,
    nodeAdapter,
    {
      bufferLogs: true,
      snapshot: true,
      // 默认解析器在 init 时已经按 100kb 注册。关掉它，再按 Fastify 原来的 1mb 自己注册。
      bodyParser: false,
      // 重复路由直接失败；被静态路径挡住的参数路由只告警，不改变 Node 适配器按特异性匹配的行为。
      routeConflictPolicy: { duplicate: 'error', shadow: 'warn' },
    },
  )

  app.useBodyParser('json', { limit: BODY_PARSER_LIMIT })
  app.useBodyParser('urlencoded', { limit: BODY_PARSER_LIMIT, extended: true })

  const configService = app.get(ConfigService<ConfigKeyPaths>)

  const { port, globalPrefix } = configService.get('app', { infer: true })

  // class-validator 的 DTO 类中注入 nest 容器的依赖 (用于自定义验证器)
  useContainer(app.select(AppModule), { fallbackOnErrors: true })

  // 允许跨域
  app.enableCors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // 明确允许方法
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'], // 按需配置允许的请求头
  })

  app.setGlobalPrefix(globalPrefix)
  // Node 适配器的静态目录是路径字符串，不再是 Fastify 的 { root }。
  app.useStaticAssets(path.join(__dirname, '..', 'public'))
  // Starts listening for shutdown hooks
  !isDev && app.enableShutdownHooks()

  if (isDev) {
    app.useGlobalInterceptors(new LoggingInterceptor())
  }

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      transformOptions: { enableImplicitConversion: true },
      // forbidNonWhitelisted: true, // 禁止 无装饰器验证的数据通过
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      stopAtFirstError: true,
      exceptionFactory: errors =>
        new UnprocessableEntityException(
          errors.map((e) => {
            const rule = Object.keys(e.constraints!)[0]
            const msg = e.constraints![rule]
            return msg
          })[0],
        ),
    }),
  )

  app.useWebSocketAdapter(new RedisIoAdapter(app))

  const printSwaggerLog = setupSwagger(app, configService)

  await app.listen(port, '0.0.0.0', async () => {
    app.useLogger(app.get(LoggerService))
    const url = await app.getUrl()
    const { pid } = process
    const env = cluster.isPrimary
    const prefix = env ? 'P' : 'W'

    if (!isMainProcess)
      return

    printSwaggerLog?.()

    const logger = new Logger('NestApplication')
    logger.log(`[${prefix + pid}] Server running on ${url}`)
  })

  if (module.hot) {
    module.hot.accept()
    module.hot.dispose(() => app.close())
  }
}

bootstrap().catch((err) => {
  console.error(err)
  process.exit(1)
})
