import { Injectable } from '@nestjs/common';
import { SysLogService } from 'src/modules/admin/system/log/log.service';
import { Mission } from '../mission.decorator';

/**
 * 管理后台日志清理任务
 */
@Injectable()
@Mission()
export class SysLogClearJob {
  constructor(private sysLogService: SysLogService) {}

  async clearLoginLog(): Promise<void> {
    await this.sysLogService.clearLoginLog();
  }

  async clearTaskLog(): Promise<void> {
    await this.sysLogService.clearTaskLog();
  }
}
