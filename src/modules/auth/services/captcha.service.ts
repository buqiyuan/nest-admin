import { Injectable } from '@nestjs/common'
import Redis from 'ioredis'

import { isEmpty } from 'lodash'
import { InjectRedis } from '~/common/decorators/inject-redis.decorator'

import { BusinessException } from '~/common/exceptions/biz.exception'
import { ErrorEnum } from '~/constants/error-code.constant'
import { genCaptchaImgKey } from '~/helper/genRedisKey'
import { CaptchaLogService } from '~/modules/system/log/services/captcha-log.service'

@Injectable()
export class CaptchaService {
  constructor(
    @InjectRedis() private redis: Redis,

    private captchaLogService: CaptchaLogService,
  ) {}

  /**
   * 校验图片验证码
   */
  async checkImgCaptcha(id: string, code: string): Promise<void> {
    const result = await this.redis.get(genCaptchaImgKey(id))
    if (isEmpty(result) || code.toLowerCase() !== result.toLowerCase())
      throw new BusinessException(ErrorEnum.INVALID_VERIFICATION_CODE)

    // 校验成功后移除验证码
    await this.redis.del(genCaptchaImgKey(id))
  }

  async log(
    account: string,
    code: string,
    provider: 'sms' | 'email',
    uid?: number,
  ): Promise<void> {
    await this.captchaLogService.create(account, code, provider, uid)
  }
}
