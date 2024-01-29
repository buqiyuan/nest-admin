import { InjectRedis } from '@liaoliaots/nestjs-redis'
import { Injectable } from '@nestjs/common'

import Redis from 'ioredis'
import { isEmpty } from 'lodash'

import { BusinessException } from '~/common/exceptions/biz.exception'

import { ErrorEnum } from '~/constants/error-code.constant'
import { genAuthPVKey, genAuthPermKey, genAuthTokenKey } from '~/helper/genRedisKey'

import { UserService } from '~/modules/user/user.service'

import { md5 } from '~/utils'

import { LoginLogService } from '../system/log/services/login-log.service'
import { MenuService } from '../system/menu/menu.service'
import { RoleService } from '../system/role/role.service'

import { TokenService } from './services/token.service'

@Injectable()
export class AuthService {
  constructor(
    @InjectRedis() private readonly redis: Redis,
    private menuService: MenuService,
    private roleService: RoleService,
    private userService: UserService,
    private loginLogService: LoginLogService,
    private tokenService: TokenService,
  ) {}

  async validateUser(credential: string, password: string): Promise<any> {
    const user = await this.userService.findUserByUserName(credential)

    if (isEmpty(user))
      throw new BusinessException(ErrorEnum.USER_NOT_FOUND)

    const comparePassword = md5(`${password}${user.psalt}`)
    if (user.password !== comparePassword)
      throw new BusinessException(ErrorEnum.INVALID_USERNAME_PASSWORD)

    if (user) {
      const { password, ...result } = user
      return result
    }

    return null
  }

  /**
   * 获取登录JWT
   * 返回null则账号密码有误，不存在该用户
   */
  async login(
    username: string,
    password: string,
    ip: string,
    ua: string,
  ): Promise<string> {
    const user = await this.userService.findUserByUserName(username)
    if (isEmpty(user))
      throw new BusinessException(ErrorEnum.INVALID_USERNAME_PASSWORD)

    const comparePassword = md5(`${password}${user.psalt}`)
    if (user.password !== comparePassword)
      throw new BusinessException(ErrorEnum.INVALID_USERNAME_PASSWORD)

    const roleIds = await this.roleService.getRoleIdsByUser(user.id)

    const roles = await this.roleService.getRoleValues(roleIds)

    // 包含access_token和refresh_token
    const token = await this.tokenService.generateAccessToken(user.id, roles)

    await this.redis.set(genAuthTokenKey(user.id), token.accessToken)

    // 设置密码版本号 当密码修改时，版本号+1
    await this.redis.set(genAuthPVKey(user.id), 1)

    // 设置菜单权限
    const permissions = await this.menuService.getPermissions(user.id)
    await this.setPermissionsCache(user.id, permissions)

    await this.loginLogService.create(user.id, ip, ua)

    return token.accessToken
  }

  /**
   * 效验账号密码
   */
  async checkPassword(username: string, password: string) {
    const user = await this.userService.findUserByUserName(username)

    const comparePassword = md5(`${password}${user.psalt}`)
    if (user.password !== comparePassword)
      throw new BusinessException(ErrorEnum.INVALID_USERNAME_PASSWORD)
  }

  async loginLog(uid: number, ip: string, ua: string) {
    await this.loginLogService.create(uid, ip, ua)
  }

  async logout(uid: number) {
    // 删除token
    await this.userService.forbidden(uid)
  }

  /**
   * 重置密码
   */
  async resetPassword(username: string, password: string) {
    const user = await this.userService.findUserByUserName(username)

    await this.userService.forceUpdatePassword(user.id, password)
  }

  /**
   * 清除登录状态信息
   */
  async clearLoginStatus(uid: number): Promise<void> {
    await this.userService.forbidden(uid)
  }

  /**
   * 获取菜单列表
   */
  async getMenus(uid: number): Promise<string[]> {
    return this.menuService.getMenus(uid)
  }

  /**
   * 获取权限列表
   */
  async getPermissions(uid: number): Promise<string[]> {
    return this.menuService.getPermissions(uid)
  }

  async getPermissionsCache(uid: number): Promise<string[]> {
    const permissionString = await this.redis.get(genAuthPermKey(uid))
    return permissionString ? JSON.parse(permissionString) : []
  }

  async setPermissionsCache(uid: number, permissions: string[]): Promise<void> {
    await this.redis.set(genAuthPermKey(uid), JSON.stringify(permissions))
  }

  async getPasswordVersionByUid(uid: number): Promise<string> {
    return this.redis.get(genAuthPVKey(uid))
  }

  async getTokenByUid(uid: number): Promise<string> {
    return this.redis.get(genAuthTokenKey(uid))
  }
}
