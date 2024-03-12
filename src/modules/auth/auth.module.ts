import { Module } from '@nestjs/common'

import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ConfigKeyPaths, ISecurityConfig } from '~/config'
import { isDev } from '~/global/env'

import { LogModule } from '../system/log/log.module'
import { MenuModule } from '../system/menu/menu.module'
import { RoleModule } from '../system/role/role.module'
import { UserModule } from '../user/user.module'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { AccountController } from './controllers/account.controller'
import { CaptchaController } from './controllers/captcha.controller'
import { EmailController } from './controllers/email.controller'
import { AccessTokenEntity } from './entities/access-token.entity'
import { RefreshTokenEntity } from './entities/refresh-token.entity'
import { CaptchaService } from './services/captcha.service'
import { TokenService } from './services/token.service'
import { JwtStrategy } from './strategies/jwt.strategy'
import { LocalStrategy } from './strategies/local.strategy'

const controllers = [
  AuthController,
  AccountController,
  CaptchaController,
  EmailController,
]
const providers = [AuthService, TokenService, CaptchaService]
const strategies = [LocalStrategy, JwtStrategy]

@Module({
  imports: [
    TypeOrmModule.forFeature([AccessTokenEntity, RefreshTokenEntity]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<ConfigKeyPaths>) => {
        const { jwtSecret, jwtExprire }
          = configService.get<ISecurityConfig>('security')

        return {
          secret: jwtSecret,
          signOptions: {
            expiresIn: `${jwtExprire}s`,
          },
          ignoreExpiration: isDev,
        }
      },
      inject: [ConfigService],
    }),
    UserModule,
    RoleModule,
    MenuModule,
    LogModule,
  ],
  controllers: [...controllers],
  providers: [...providers, ...strategies],
  exports: [TypeOrmModule, JwtModule, ...providers],
})
export class AuthModule {}
