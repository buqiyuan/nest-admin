import { Body, Controller, Get, Post } from '@nestjs/common'
import { ApiExtraModels, ApiOperation, ApiTags } from '@nestjs/swagger'

import { ApiResult } from '~/common/decorators/api-result.decorator'
import { ApiSecurityAuth } from '~/common/decorators/swagger.decorator'
import { BusinessException } from '~/common/exceptions/biz.exception'
import { ErrorEnum } from '~/constants/error-code.constant'

import { AuthUser } from '~/modules/auth/decorators/auth-user.decorator'

import { Perm } from '~/modules/auth/decorators/permission.decorator'

import { KickDto } from './online.dto'
import { OnlineUserInfo } from './online.model'
import { OnlineService } from './online.service'

@ApiTags('System - 在线用户模块')
@ApiSecurityAuth()
@ApiExtraModels(OnlineUserInfo)
@Controller('online')
export class OnlineController {
  constructor(private onlineService: OnlineService) {}

  @Get('list')
  @ApiOperation({ summary: '查询当前在线用户' })
  @ApiResult({ type: [OnlineUserInfo] })
  @Perm('system:online:list')
  async list(@AuthUser() user: IAuthUser): Promise<OnlineUserInfo[]> {
    return this.onlineService.listOnlineUser(user.uid)
  }

  @Post('kick')
  @ApiOperation({ summary: '下线指定在线用户' })
  @Perm('system:online:kick')
  async kick(@Body() dto: KickDto, @AuthUser() user: IAuthUser): Promise<void> {
    if (dto.id === user.uid)
      throw new BusinessException(ErrorEnum.NOT_ALLOWED_TO_LOGOUT_USER)

    await this.onlineService.kickUser(dto.id, user.uid)
  }
}
