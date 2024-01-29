import { Inject, Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

import { ISecurityConfig, SecurityConfig } from '~/config'

import { AuthStrategy } from '../auth.constant'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, AuthStrategy.JWT) {
  constructor(
    @Inject(SecurityConfig.KEY) private securityConfig: ISecurityConfig,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: securityConfig.jwtSecret,
    })
  }

  async validate(payload: IAuthUser) {
    return payload
  }
}
