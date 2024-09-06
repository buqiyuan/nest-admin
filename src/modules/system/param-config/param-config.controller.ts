import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

import { ApiResult } from '~/common/decorators/api-result.decorator'
import { IdParam } from '~/common/decorators/id-param.decorator'
import { ApiSecurityAuth } from '~/common/decorators/swagger.decorator'
import { Pagination } from '~/helper/paginate/pagination'
import { definePermission, Perm } from '~/modules/auth/decorators/permission.decorator'
import { ParamConfigEntity } from '~/modules/system/param-config/param-config.entity'

import { ParamConfigDto, ParamConfigQueryDto } from './param-config.dto'
import { ParamConfigService } from './param-config.service'

export const permissions = definePermission('system:param-config', {
  LIST: 'list',
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
} as const)

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
