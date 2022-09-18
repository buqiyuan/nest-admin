import {
  HttpStatus,
  Logger,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ValidationError } from 'class-validator';
import { AppModule } from './app.module';
import { ApiExceptionFilter } from './common/filters/api-exception.filter';
import { ApiTransformInterceptor } from './common/interceptors/api-transform.interceptor';
import { setupSwagger } from './setup-swagger';
import { LoggerService } from './shared/logger/logger.service';

const PORT = process.env.PORT;

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      bufferLogs: true,
    },
  );
  app.enableCors();
  // 给请求添加prefix
  // app.setGlobalPrefix(PREFIX);
  // custom logger
  app.useLogger(app.get(LoggerService));
  // validate
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      exceptionFactory: (errors: ValidationError[]) => {
        return new UnprocessableEntityException(
          errors
            .filter((item) => !!item.constraints)
            .flatMap((item) => Object.values(item.constraints))
            .join('; '),
        );
      },
    }),
  );
  // execption
  app.useGlobalFilters(new ApiExceptionFilter(app.get(LoggerService)));
  // api interceptor
  app.useGlobalInterceptors(new ApiTransformInterceptor(new Reflector()));
  // websocket
  app.useWebSocketAdapter(new IoAdapter());
  // swagger
  setupSwagger(app);
  // start
  await app.listen(PORT, '0.0.0.0');
  const serverUrl = await app.getUrl();
  Logger.log(`api服务已经启动,请访问: ${serverUrl}`);
  Logger.log(`API文档已生成,请访问: ${serverUrl}/${process.env.SWAGGER_PATH}/`);
  Logger.log(
    `ws服务已经启动,请访问: http://localhost:${process.env.WS_PORT}${process.env.WS_PATH}`,
  );
}

bootstrap();
