import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
} from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

import { ApiResult } from '~/common/decorators/api-result.decorator'
import { IdParam } from '~/common/decorators/id-param.decorator'
import { ApiSecurityAuth } from '~/common/decorators/swagger.decorator'
import { PagerDto } from '~/common/dto/pager.dto'
import { Perm, PermissionMap } from '~/modules/auth/decorators/permission.decorator'
import { RoleEntity } from '~/modules/system/role/role.entity'

import { MenuService } from '../menu/menu.service'

import { RoleDto, RoleUpdateDto } from './role.dto'
import { RoleInfo } from './role.model'
import { RoleService } from './role.service'

export const permissions: PermissionMap<'system:role'> = {
  LIST: 'system:role:list',
  CREATE: 'system:role:create',
  READ: 'system:role:read',
  UPDATE: 'system:role:update',
  DELETE: 'system:role:delete',
} as const

@ApiTags('System - 角色模块')
@ApiSecurityAuth()
@Controller('roles')
export class RoleController {
  constructor(
    private roleService: RoleService,
    private menuService: MenuService,
  ) {}

  @Get()
  @ApiOperation({ summary: '获取角色列表' })
  @ApiResult({ type: [RoleEntity], isPage: true })
  @Perm(permissions.LIST)
  async list(@Query() dto: PagerDto) {
    return this.roleService.findAll(dto)
  }

  @Get(':id')
  @ApiOperation({ summary: '获取角色信息' })
  @ApiResult({ type: RoleInfo })
  @Perm(permissions.READ)
  async info(@IdParam() id: number) {
    return this.roleService.info(id)
  }

  @Post()
  @ApiOperation({ summary: '新增角色' })
  @Perm(permissions.CREATE)
  async create(@Body() dto: RoleDto): Promise<void> {
    await this.roleService.create(dto)
  }

  @Put(':id')
  @ApiOperation({ summary: '更新角色' })
  @Perm(permissions.UPDATE)
  async update(
    @IdParam() id: number, @Body() dto: RoleUpdateDto): Promise<void> {
    await this.roleService.update(id, dto)
    await this.menuService.refreshOnlineUserPerms()
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除角色' })
  @Perm(permissions.DELETE)
  async delete(@IdParam() id: number): Promise<void> {
    if (await this.roleService.checkUserByRoleId(id))
      throw new BadRequestException('该角色存在关联用户，无法删除')

    await this.roleService.delete(id)
    await this.menuService.refreshOnlineUserPerms()
  }
}
