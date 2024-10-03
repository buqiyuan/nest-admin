import { Injectable } from '@nestjs/common'
import Redis from 'ioredis'

import { throttle } from 'lodash'

import { UAParser } from 'ua-parser-js'
import { InjectRedis } from '~/common/decorators/inject-redis.decorator'

import { BusinessException } from '~/common/exceptions/biz.exception'
import { ErrorEnum } from '~/constants/error-code.constant'

import { genOnlineUserKey } from '~/helper/genRedisKey'
import { AuthService } from '~/modules/auth/auth.service'
import { AccessTokenEntity } from '~/modules/auth/entities/access-token.entity'

import { TokenService } from '~/modules/auth/services/token.service'
import { SseService } from '~/modules/sse/sse.service'
import { getIpAddress } from '~/utils'

import { UserService } from '../../user/user.service'

import { OnlineUserInfo } from './online.model'

@Injectable()
export class OnlineService {
  constructor(
    @InjectRedis() private redis: Redis,
    private readonly userService: UserService,
    private authService: AuthService,
    private tokenService: TokenService,
    private sseService: SseService,
  ) {}

  /** 在线用户数量变动时，通知前端实时更新在线用户数量或列表, 3 秒内最多推送一次，避免频繁触发 */
  updateOnlineUserCount = throttle(async () => {
    const keys = await this.redis.keys(genOnlineUserKey('*'))
    this.sseService.sendToAllUser({ type: 'updateOnlineUserCount', data: keys.length })
  }, 3000)

  async addOnlineUser(value: string, ip: string, ua: string) {
    const token = await AccessTokenEntity.findOne({
      where: { value },
      relations: {
        user: {
          dept: true,
        },
      },
      cache: true,
    })

    if (!token)
      return

    const tokenPaload = await this.tokenService.verifyAccessToken(value)
    const exp = ~~(tokenPaload.exp - Date.now() / 1000)
    const parser = new UAParser()
    const uaResult = parser.setUA(ua).getResult()
    const address = await getIpAddress(ip)

    const result: OnlineUserInfo = {
      ip,
      address,
      tokenId: token.id,
      uid: token.user.id,
      deptName: token.user.dept?.name ?? '',
      os: `${`${uaResult.os.name ?? ''} `}${uaResult.os.version}`,
      browser: `${`${uaResult.browser.name ?? ''} `}${uaResult.browser.version}`,
      username: token.user.username,
      time: token.created_at.toString(),
    }
    await this.redis.set(genOnlineUserKey(token.id), JSON.stringify(result), 'EX', exp)
    this.updateOnlineUserCount()
  }

  async removeOnlineUser(value: string) {
    const token = await AccessTokenEntity.findOne({
      where: { value },
      relations: ['user'],
      cache: true,
    })
    await this.redis.del(genOnlineUserKey(token?.id))
    this.updateOnlineUserCount()
  }

  /** 移除所有在线用户 */
  async clearOnlineUser() {
    const keys = await this.redis.keys(genOnlineUserKey('*'))
    await this.redis.del(keys)
  }

  /**
   * 罗列在线用户列表
   */
  async listOnlineUser(value: string): Promise<OnlineUserInfo[]> {
    const token = await AccessTokenEntity.findOne({
      where: { value },
      relations: ['user'],
      cache: true,
    })
    const keys = await this.redis.keys(genOnlineUserKey('*'))
    const users = await this.redis.mget(keys)
    const rootUserId = await this.userService.findRootUserId()

    return users.map((e) => {
      const item = JSON.parse(e) as OnlineUserInfo
      item.isCurrent = token?.id === item.tokenId
      item.disable = item.isCurrent || item.uid === rootUserId
      return item
    }).sort((a, b) => a.time > b.time ? -1 : 1)
  }

  /**
   * 下线当前用户
   */
  async kickUser(tokenId: string, user: IAuthUser): Promise<void> {
    const token = await AccessTokenEntity.findOne({
      where: { id: tokenId },
      relations: ['user'],
      cache: true,
    })
    if (!token)
      return
    const rootUserId = await this.userService.findRootUserId()
    const targetUid = token.user.id
    if (targetUid === rootUserId || targetUid === user.uid)
      throw new BusinessException(ErrorEnum.NOT_ALLOWED_TO_LOGOUT_USER)

    const targetUser = await this.tokenService.verifyAccessToken(token.value)
    await this.authService.clearLoginStatus(targetUser, token.value)
  }
}
