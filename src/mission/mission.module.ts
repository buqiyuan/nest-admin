import { DynamicModule, ExistingProvider, Module } from '@nestjs/common';
import { AdminModule } from 'src/modules/admin/admin.module';
import { SysLogService } from 'src/modules/admin/system/log/log.service';
import { HttpRequestJob } from './jobs/http-request.job';
import { SysLogClearJob } from './jobs/sys-log-clear.job';

const providers = [SysLogClearJob, HttpRequestJob];

/**
 * auto create alias
 * {
 *    provide: 'SysLogClearMissionService',
 *    useExisting: SysLogClearMissionService,
 *  }
 */
function createAliasProviders(): ExistingProvider[] {
  const aliasProviders: ExistingProvider[] = [];
  for (const p of providers) {
    aliasProviders.push({
      provide: p.name,
      useExisting: p,
    });
  }
  return aliasProviders;
}

/**
 * 所有需要执行的定时任务都需要在这里注册
 */
@Module({})
export class MissionModule {
  static forRoot(): DynamicModule {
    // 使用Alias定义别名，使得可以通过字符串类型获取定义的Service，否则无法获取
    const aliasProviders = createAliasProviders();
    return {
      global: true,
      module: MissionModule,
      imports: [AdminModule],
      providers: [...providers, ...aliasProviders, SysLogService],
      exports: aliasProviders,
    };
  }
}
