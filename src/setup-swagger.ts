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
): void {
  const { name, globalPrefix, baseUrl } = configService.get<IAppConfig>('app')!
  const { enable, path } = configService.get<ISwaggerConfig>('swagger')!

  if (!enable)
    return

  const swaggerPath = `${baseUrl}/${path}`

  const documentBuilder = new DocumentBuilder()
    .setTitle(name)
    .setDescription(`
🔷 **Base URL**: \`${baseUrl}/${globalPrefix}\` <br>
🧾 **Swagger JSON**: [查看文档 JSON](${swaggerPath}/json)

📌 [nest-admin](https://github.com/buqiyuan/nest-admin) 后台管理系统 API 文档. 在线 demo [vue3-antdv-admin.pages.dev](https://vue3-antdv-admin.pages.dev/)
    `)
    .setVersion('1.0')
    .addServer(`${baseUrl}/${globalPrefix}`, 'Base URL') 

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

  // started log
  const logger = new Logger('SwaggerModule')
  logger.log(`Document running on ${swaggerPath}`)
}
