import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { PageResult } from 'src/common/class/res.class';
import { PageOptionsDto } from 'src/common/dto/page.dto';
import { ADMIN_PREFIX } from '../../admin.constants';
import { LogDisabled } from '../../core/decorators/log-disabled.decorator';
import { LoginLogInfo, TaskLogInfo } from './log.class';
import { SysLogService } from './log.service';

@ApiSecurity(ADMIN_PREFIX)
@ApiTags('日志模块')
@Controller('log')
export class SysLogController {
  constructor(private logService: SysLogService) {}

  @ApiOperation({ summary: '分页查询登录日志' })
  @ApiOkResponse({ type: [LoginLogInfo] })
  @LogDisabled()
  @Get('login/page')
  async loginLogPage(
    @Query() dto: PageOptionsDto,
  ): Promise<PageResult<LoginLogInfo>> {
    const list = await this.logService.pageGetLoginLog(dto.page - 1, dto.limit);
    const count = await this.logService.countLoginLog();
    return {
      list,
      pagination: {
        total: count,
        size: dto.limit,
        page: dto.page,
      },
    };
  }

  @ApiOperation({ summary: '分页查询任务日志' })
  @ApiOkResponse({ type: [TaskLogInfo] })
  @LogDisabled()
  @Get('task/page')
  async taskPage(
    @Query() dto: PageOptionsDto,
  ): Promise<PageResult<TaskLogInfo>> {
    const list = await this.logService.page(dto.page - 1, dto.limit);
    const count = await this.logService.countTaskLog();
    return {
      list,
      pagination: {
        total: count,
        size: dto.limit,
        page: dto.page,
      },
    };
  }
}
