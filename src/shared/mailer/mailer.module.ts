import { join } from 'node:path'

import { Module, Provider } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MailerModule as NestMailerModule } from '@nestjs-modules/mailer'
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'

import { ConfigKeyPaths, IAppConfig, IMailerConfig } from '~/config'

import { MailerService } from './mailer.service'

const providers: Provider<any>[] = [
  MailerService,
]

@Module({
  imports: [
    NestMailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<ConfigKeyPaths>) => ({
        transport: configService.get<IMailerConfig>('mailer'),
        defaults: {
          from: {
            name: configService.get<IAppConfig>('app').name,
            address: configService.get<IMailerConfig>('mailer').auth.user,
          },
        },
        template: {
          dir: join(__dirname, '..', '..', '/assets/templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers,
  exports: providers,
})
export class MailerModule {}
