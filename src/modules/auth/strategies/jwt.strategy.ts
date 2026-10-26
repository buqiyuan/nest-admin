import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

import { ISecurityConfig, SecurityConfig } from '~/config'
import { RoleService } from '~/modules/system/role/role.service'
import { UserService } from '~/modules/user/user.service'

import { AuthStrategy } from '../auth.constant'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, AuthStrategy.JWT) {
  constructor(
    @Inject(SecurityConfig.KEY) private securityConfig: ISecurityConfig,
    private readonly userService: UserService,
    private readonly roleService: RoleService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: securityConfig.jwtSecret,
    })
  }

  /**
   * 不把 JWT 里的 roles 当作权限依据。
   * 用户必须仍然存在且启用，角色以数据库当前绑定为准。
   */
  async validate(payload: IAuthUser): Promise<IAuthUser> {
    if (!payload?.uid)
      throw new UnauthorizedException()

    const user = await this.userService.findUserById(payload.uid)
    if (!user)
      throw new UnauthorizedException()

    const roles = await this.roleService.getRoleValuesByUser(payload.uid)

    return {
      uid: payload.uid,
      pv: payload.pv,
      exp: payload.exp,
      iat: payload.iat,
      roles,
    }
  }
}
