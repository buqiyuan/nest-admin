import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

import { ApiResult } from '~/common/decorators/api-result.decorator'
import { IdParam } from '~/common/decorators/id-param.decorator'
import { ApiSecurityAuth } from '~/common/decorators/swagger.decorator'
import { Pagination } from '~/helper/paginate/pagination'
import { Perm, PermissionMap } from '~/modules/auth/decorators/permission.decorator'
import { ParamConfigEntity } from '~/modules/system/param-config/param-config.entity'

import { ParamConfigDto, ParamConfigQueryDto } from './param-config.dto'
import { ParamConfigService } from './param-config.service'

export const permissions: PermissionMap<'system:param-config'> = {
  LIST: 'system:param-config:list',
  CREATE: 'system:param-config:create',
  READ: 'system:param-config:read',
  UPDATE: 'system:param-config:update',
  DELETE: 'system:param-config:delete',
} as const

@ApiTags('System - 参数配置模块')
@ApiSecurityAuth()
@Controller('param-config')
export class ParamConfigController {
  constructor(private paramConfigService: ParamConfigService) {}

  @Get()
  @ApiOperation({ summary: '获取参数配置列表' })
  @ApiResult({ type: [ParamConfigEntity], isPage: true })
  @Perm(permissions.LIST)
  async list(@Query() dto: ParamConfigQueryDto): Promise<Pagination<ParamConfigEntity>> {
    return this.paramConfigService.page(dto)
  }

  @Post()
  @ApiOperation({ summary: '新增参数配置' })
  @Perm(permissions.CREATE)
  async create(@Body() dto: ParamConfigDto): Promise<void> {
    await this.paramConfigService.isExistKey(dto.key)
    await this.paramConfigService.create(dto)
  }

  @Get(':id')
  @ApiOperation({ summary: '查询参数配置信息' })
  @ApiResult({ type: ParamConfigEntity })
  @Perm(permissions.READ)
  async info(@IdParam() id: number): Promise<ParamConfigEntity> {
    return this.paramConfigService.findOne(id)
  }

  @Post(':id')
  @ApiOperation({ summary: '更新参数配置' })
  @Perm(permissions.UPDATE)
  async update(@IdParam() id: number, @Body() dto: ParamConfigDto): Promise<void> {
    await this.paramConfigService.update(id, dto)
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除指定的参数配置' })
  @Perm(permissions.DELETE)
  async delete(@IdParam() id: number): Promise<void> {
    await this.paramConfigService.delete(id)
  }
}
