import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { ADMIN_PREFIX } from './modules/admin/admin.constants';
import { ConfigurationKeyPaths } from '@/config/configuration';

export function setupSwagger(app: INestApplication): void {
  const configService: ConfigService<ConfigurationKeyPaths> =
    app.get(ConfigService);

  // 默认为启用
  const enable = configService.get<boolean>('swagger.enable', true);

  // 判断是否需要启用
  if (!enable) {
    return;
  }

  const swaggerConfig = new DocumentBuilder()
    .setTitle(configService.get<string>('swagger.title'))
    .setDescription(configService.get<string>('swagger.desc'))
    .setLicense('MIT', 'https://github.com/buqiyuan/nest-admin')
    // JWT鉴权
    .addSecurity(ADMIN_PREFIX, {
      description: '后台管理接口授权',
      type: 'apiKey',
      in: 'header',
      name: 'Authorization',
    })
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup(
    configService.get<string>('swagger.path', '/swagger-api'),
    app,
    document,
  );
}
