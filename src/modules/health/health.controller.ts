import { Controller, Get } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import {
  DiskHealthIndicator,
  HealthCheck,
  HttpHealthIndicator,
  MemoryHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus'

import { definePermission, Perm } from '../auth/decorators/permission.decorator'

export const PermissionHealth = definePermission('app:health', {
  NETWORK: 'network',
  DB: 'database',
  MH: 'memory-heap',
  MR: 'memory-rss',
  DISK: 'disk',
} as const)

@ApiTags('Health - 健康检查')
@Controller('health')
export class HealthController {
  constructor(
    private http: HttpHealthIndicator,
    private db: TypeOrmHealthIndicator,
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator,
  ) {}

  @Get('network')
  @HealthCheck()
  @Perm(PermissionHealth.NETWORK)
  async checkNetwork() {
    return this.http.pingCheck('buqiyuan', 'https://buqiyuan.gitee.io/')
  }

  @Get('database')
  @HealthCheck()
  @Perm(PermissionHealth.DB)
  async checkDatabase() {
    return this.db.pingCheck('database')
  }

  @Get('memory-heap')
  @HealthCheck()
  @Perm(PermissionHealth.MH)
  async checkMemoryHeap() {
    // the process should not use more than 200MB memory
    return this.memory.checkHeap('memory-heap', 200 * 1024 * 1024)
  }

  @Get('memory-rss')
  @HealthCheck()
  @Perm(PermissionHealth.MR)
  async checkMemoryRSS() {
    // the process should not have more than 200MB RSS memory allocated
    return this.memory.checkRSS('memory-rss', 200 * 1024 * 1024)
  }

  @Get('disk')
  @HealthCheck()
  @Perm(PermissionHealth.DISK)
  async checkDisk() {
    return this.disk.checkStorage('disk', {
      // The used disk storage should not exceed 75% of the full disk size
      thresholdPercent: 0.75,
      path: '/',
    })
  }
}
