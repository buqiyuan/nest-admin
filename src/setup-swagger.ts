import { INestApplication, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { API_SECURITY_AUTH } from './common/decorators/swagger.decorator'
import { CommonEntity } from './common/entity/common.entity'
import { ResOp, TreeResult } from './common/model/response.model'
import { ConfigKeyPaths, IAppConfig, ISwaggerConfig } from './config'
import { Pagination } from './helper/paginate/pagination'

export function setupSwagger(
  app: INestApplication,
  configService: ConfigService<ConfigKeyPaths>,
) {
  const { name, globalPrefix } = configService.get<IAppConfig>('app')!
  const { enable, path, serverUrl } = configService.get<ISwaggerConfig>('swagger')!

  if (!enable)
    return

  const swaggerPath = `${serverUrl}/${path}`

  const documentBuilder = new DocumentBuilder()
    .setTitle(name)
    .setDescription(`
🔷 **Base URL**: \`${serverUrl}/${globalPrefix}\` <br>
🧾 **Swagger JSON**: [查看文档 JSON](${swaggerPath}/json)

📌 [nest-admin](https://github.com/buqiyuan/nest-admin) 后台管理系统 API 文档. 在线 demo [vue3-antdv-admin.pages.dev](https://vue3-antdv-admin.pages.dev) ，API [nest-admin-api.pages.dev](https://nest-admin-api.pages.dev)
    `)
    .setVersion('1.0')
    .addServer(`${serverUrl}/${globalPrefix}`, 'Base URL')

  // auth security
  documentBuilder.addSecurity(API_SECURITY_AUTH, {
    description: '输入令牌（Enter the token）',
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
  })

  const document = SwaggerModule.createDocument(app, documentBuilder.build(), {
    ignoreGlobalPrefix: true,
    extraModels: [CommonEntity, ResOp, Pagination, TreeResult],
  })

  SwaggerModule.setup(path, app, document, {
    swaggerOptions: {
      persistAuthorization: true, // 保持登录
    },
    jsonDocumentUrl: `/${path}/json`,
  })

  return () => {
  // started log
    const logger = new Logger('SwaggerModule')
    logger.log(`Swagger UI: ${swaggerPath}`)
    logger.log(`Swagger JSON: ${swaggerPath}/json`)
  }
}
