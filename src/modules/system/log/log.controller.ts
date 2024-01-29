import { Controller, Get, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

import { ApiResult } from '~/common/decorators/api-result.decorator'
import { ApiSecurityAuth } from '~/common/decorators/swagger.decorator'
import { Pagination } from '~/helper/paginate/pagination'
import { Perm, PermissionMap } from '~/modules/auth/decorators/permission.decorator'

import {
  CaptchaLogQueryDto,
  LoginLogQueryDto,
  TaskLogQueryDto,
} from './dto/log.dto'
import { CaptchaLogEntity } from './entities/captcha-log.entity'
import { TaskLogEntity } from './entities/task-log.entity'
import { LoginLogInfo } from './models/log.model'
import { CaptchaLogService } from './services/captcha-log.service'
import { LoginLogService } from './services/login-log.service'
import { TaskLogService } from './services/task-log.service'

export const permissions: PermissionMap = {
  TaskList: 'system:log:task:list',
  LogList: 'system:log:login:list',
  CaptchaList: 'system:log:captcha:list',
}

@ApiSecurityAuth()
@ApiTags('System - 日志模块')
@Controller('log')
export class LogController {
  constructor(
    private loginLogService: LoginLogService,
    private taskService: TaskLogService,
    private captchaLogService: CaptchaLogService,
  ) {}

  @Get('login/list')
  @ApiOperation({ summary: '查询登录日志列表' })
  @ApiResult({ type: [LoginLogInfo], isPage: true })
  @Perm(permissions.TaskList)
  async loginLogPage(
    @Query() dto: LoginLogQueryDto,
  ): Promise<Pagination<LoginLogInfo>> {
    return this.loginLogService.list(dto)
  }

  @Get('task/list')
  @ApiOperation({ summary: '查询任务日志列表' })
  @ApiResult({ type: [TaskLogEntity], isPage: true })
  @Perm(permissions.LogList)
  async taskList(@Query() dto: TaskLogQueryDto) {
    return this.taskService.list(dto)
  }

  @Get('captcha/list')
  @ApiOperation({ summary: '查询验证码日志列表' })
  @ApiResult({ type: [CaptchaLogEntity], isPage: true })
  @Perm(permissions.CaptchaList)
  async captchaList(
    @Query() dto: CaptchaLogQueryDto,
  ): Promise<Pagination<CaptchaLogEntity>> {
    return this.captchaLogService.paginate(dto)
  }
}
