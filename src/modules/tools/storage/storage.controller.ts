import { Body, Controller, Get, Post, Query } from '@nestjs/common'

import { ApiOperation, ApiTags } from '@nestjs/swagger'

import { ApiResult } from '~/common/decorators/api-result.decorator'
import { ApiSecurityAuth } from '~/common/decorators/swagger.decorator'

import { Pagination } from '~/helper/paginate/pagination'

import { Perm } from '~/modules/auth/decorators/permission.decorator'

import { StorageDeleteDto, StoragePageDto } from './storage.dto'
import { StorageInfo } from './storage.modal'
import { StorageService } from './storage.service'

@ApiTags('Tools - 存储模块')
@ApiSecurityAuth()
@Controller('storage')
export class StorageController {
  constructor(private storageService: StorageService) {}

  @Get('list')
  @ApiOperation({ summary: '获取本地存储列表' })
  @ApiResult({ type: [StorageInfo], isPage: true })
  @Perm('tool:storage:list')
  async list(@Query() dto: StoragePageDto): Promise<Pagination<StorageInfo>> {
    return this.storageService.list(dto)
  }

  @ApiOperation({ summary: '删除文件' })
  @Post('delete')
  @Perm('tool:storage:delete')
  async delete(@Body() dto: StorageDeleteDto): Promise<void> {
    await this.storageService.delete(dto.ids)
  }
}
