import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

import { ApiResult } from '~/common/decorators/api-result.decorator'
import { IdParam } from '~/common/decorators/id-param.decorator'
import { ApiSecurityAuth } from '~/common/decorators/swagger.decorator'
import { Pagination } from '~/helper/paginate/pagination'
import { AuthUser } from '~/modules/auth/decorators/auth-user.decorator'
import { Perm, PermissionMap } from '~/modules/auth/decorators/permission.decorator'
import { DictTypeEntity } from '~/modules/system/dict-type/dict-type.entity'

import { DictTypeDto, DictTypeQueryDto } from './dict-type.dto'
import { DictTypeService } from './dict-type.service'

export const permissions: PermissionMap<'system:dict-type'> = {
  LIST: 'system:dict-type:list',
  CREATE: 'system:dict-type:create',
  READ: 'system:dict-type:read',
  UPDATE: 'system:dict-type:update',
  DELETE: 'system:dict-type:delete',
} as const

@ApiTags('System - 字典类型模块')
@ApiSecurityAuth()
@Controller('dict-type')
export class DictTypeController {
  constructor(private dictTypeService: DictTypeService) {}

  @Get()
  @ApiOperation({ summary: '获取字典类型列表' })
  @ApiResult({ type: [DictTypeEntity], isPage: true })
  @Perm(permissions.LIST)
  async list(@Query() dto: DictTypeQueryDto): Promise<Pagination<DictTypeEntity>> {
    return this.dictTypeService.page(dto)
  }

  @Get('select-options')
  @ApiOperation({ summary: '一次性获取所有的字典类型(不分页)' })
  @ApiResult({ type: [DictTypeEntity] })
  @Perm(permissions.LIST)
  async getAll(): Promise<DictTypeEntity[]> {
    return this.dictTypeService.getAll()
  }

  @Post()
  @ApiOperation({ summary: '新增字典类型' })
  @Perm(permissions.CREATE)
  async create(@Body() dto: DictTypeDto, @AuthUser() user: IAuthUser): Promise<void> {
    await this.dictTypeService.isExistKey(dto.name)
    dto.createBy = dto.updateBy = user.uid
    await this.dictTypeService.create(dto)
  }

  @Get(':id')
  @ApiOperation({ summary: '查询字典类型信息' })
  @ApiResult({ type: DictTypeEntity })
  @Perm(permissions.READ)
  async info(@IdParam() id: number): Promise<DictTypeEntity> {
    return this.dictTypeService.findOne(id)
  }

  @Post(':id')
  @ApiOperation({ summary: '更新字典类型' })
  @Perm(permissions.UPDATE)
  async update(@IdParam() id: number, @Body() dto: DictTypeDto, @AuthUser() user: IAuthUser): Promise<void> {
    dto.updateBy = user.uid
    await this.dictTypeService.update(id, dto)
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除指定的字典类型' })
  @Perm(permissions.DELETE)
  async delete(@IdParam() id: number): Promise<void> {
    await this.dictTypeService.delete(id)
  }
}
