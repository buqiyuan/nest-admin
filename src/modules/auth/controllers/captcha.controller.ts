import { Controller, Get, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import Redis from 'ioredis'

import { isEmpty } from 'lodash'
import * as svgCaptcha from 'svg-captcha'
import { ApiResult } from '~/common/decorators/api-result.decorator'

import { InjectRedis } from '~/common/decorators/inject-redis.decorator'
import { genCaptchaImgKey } from '~/helper/genRedisKey'
import { generateUUID } from '~/utils'

import { Public } from '../decorators/public.decorator'

import { ImageCaptchaDto } from '../dto/captcha.dto'
import { ImageCaptcha } from '../models/auth.model'

@ApiTags('Captcha - 验证码模块')
// @UseGuards(ThrottlerGuard)
@Controller('auth/captcha')
export class CaptchaController {
  constructor(@InjectRedis() private redis: Redis) {}

  @Get('img')
  @ApiOperation({ summary: '获取登录图片验证码' })
  @ApiResult({ type: ImageCaptcha })
  @Public()
  // @Throttle({ default: { limit: 2, ttl: 600000 } })
  async captchaByImg(@Query() dto: ImageCaptchaDto): Promise<ImageCaptcha> {
    const { width, height } = dto

    const svg = svgCaptcha.create({
      size: 4,
      color: true,
      noise: 4,
      width: isEmpty(width) ? 100 : width,
      height: isEmpty(height) ? 50 : height,
      charPreset: '1234567890',
    })
    const result = {
      img: `data:image/svg+xml;base64,${Buffer.from(svg.data).toString(
        'base64',
      )}`,
      id: generateUUID(),
    }
    // 5分钟过期时间
    await this.redis.set(genCaptchaImgKey(result.id), svg.text, 'EX', 60 * 5)
    return result
  }
}
