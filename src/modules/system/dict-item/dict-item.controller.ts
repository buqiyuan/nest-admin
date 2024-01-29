import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

import { ApiResult } from '~/common/decorators/api-result.decorator'
import { IdParam } from '~/common/decorators/id-param.decorator'
import { ApiSecurityAuth } from '~/common/decorators/swagger.decorator'
import { Pagination } from '~/helper/paginate/pagination'
import { AuthUser } from '~/modules/auth/decorators/auth-user.decorator'
import { Perm, PermissionMap } from '~/modules/auth/decorators/permission.decorator'
import { DictItemEntity } from '~/modules/system/dict-item/dict-item.entity'

import { DictItemDto, DictItemQueryDto } from './dict-item.dto'
import { DictItemService } from './dict-item.service'

export const permissions: PermissionMap<'system:dict-item'> = {
  LIST: 'system:dict-item:list',
  CREATE: 'system:dict-item:create',
  READ: 'system:dict-item:read',
  UPDATE: 'system:dict-item:update',
  DELETE: 'system:dict-item:delete',
} as const

@ApiTags('System - 字典项模块')
@ApiSecurityAuth()
@Controller('dict-item')
export class DictItemController {
  constructor(private dictItemService: DictItemService) {}

  @Get()
  @ApiOperation({ summary: '获取字典项列表' })
  @ApiResult({ type: [DictItemEntity], isPage: true })
  @Perm(permissions.LIST)
  async list(@Query() dto: DictItemQueryDto): Promise<Pagination<DictItemEntity>> {
    return this.dictItemService.page(dto)
  }

  @Post()
  @ApiOperation({ summary: '新增字典项' })
  @Perm(permissions.CREATE)
  async create(@Body() dto: DictItemDto, @AuthUser() user: IAuthUser): Promise<void> {
    await this.dictItemService.isExistKey(dto)
    dto.createBy = dto.updateBy = user.uid
    await this.dictItemService.create(dto)
  }

  @Get(':id')
  @ApiOperation({ summary: '查询字典项信息' })
  @ApiResult({ type: DictItemEntity })
  @Perm(permissions.READ)
  async info(@IdParam() id: number): Promise<DictItemEntity> {
    return this.dictItemService.findOne(id)
  }

  @Post(':id')
  @ApiOperation({ summary: '更新字典项' })
  @Perm(permissions.UPDATE)
  async update(@IdParam() id: number, @Body() dto: DictItemDto, @AuthUser() user: IAuthUser): Promise<void> {
    dto.updateBy = user.uid
    await this.dictItemService.update(id, dto)
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除指定的字典项' })
  @Perm(permissions.DELETE)
  async delete(@IdParam() id: number): Promise<void> {
    await this.dictItemService.delete(id)
  }
}
