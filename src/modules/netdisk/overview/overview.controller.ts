import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager'
import {
  Controller,
  Get,
  UseInterceptors,
} from '@nestjs/common'
import {
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'

import { definePermission, Perm } from '~/modules/auth/decorators/permission.decorator'

import { OverviewSpaceInfo } from './overview.dto'
import { NetDiskOverviewService } from './overview.service'

export const permissions = definePermission('netdisk:overview', {
  DESC: 'desc',
} as const)

@ApiTags('NetDiskOverview - 网盘概览模块')
@Controller('overview')
export class NetDiskOverviewController {
  constructor(private overviewService: NetDiskOverviewService) {}

  @Get('desc')
  @CacheKey('netdisk_overview_desc')
  @CacheTTL(3600)
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({ summary: '获取网盘空间数据统计' })
  @ApiOkResponse({ type: OverviewSpaceInfo })
  @Perm(permissions.DESC)
  async space(): Promise<OverviewSpaceInfo> {
    const date = this.overviewService.getZeroHourAnd1Day(new Date())
    const hit = await this.overviewService.getHit(date)
    const flow = await this.overviewService.getFlow(date)
    const space = await this.overviewService.getSpace(date)
    const count = await this.overviewService.getCount(date)
    return {
      fileSize: count.datas[count.datas.length - 1],
      flowSize: flow.datas[flow.datas.length - 1],
      hitSize: hit.datas[hit.datas.length - 1],
      spaceSize: space.datas[space.datas.length - 1],
      flowTrend: flow,
      sizeTrend: space,
    }
  }
}
