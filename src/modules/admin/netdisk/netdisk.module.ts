import { Module } from '@nestjs/common';
import { qiniuProvider } from '../core/provider/qiniu.provider';
import { SystemModule } from '../system/system.module';
import { NetDiskManageController } from './manager/manage.controller';
import { NetDiskManageService } from './manager/manage.service';
import { NetDiskOverviewController } from './overview/overview.controller';
import { NetDiskOverviewService } from './overview/overview.service';

@Module({
  imports: [SystemModule],
  controllers: [NetDiskManageController, NetDiskOverviewController],
  providers: [NetDiskManageService, NetDiskOverviewService, qiniuProvider()],
})
export class NetdiskModule {}
