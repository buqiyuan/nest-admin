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
import { flattenDeep } from 'lodash'

import { ApiResult } from '~/common/decorators/api-result.decorator'
import { IdParam } from '~/common/decorators/id-param.decorator'
import { ApiSecurityAuth } from '~/common/decorators/swagger.decorator'
import { Perm, PermissionMap } from '~/modules/auth/decorators/permission.decorator'

import { MenuDto, MenuQueryDto, MenuUpdateDto } from './menu.dto'
import { MenuItemInfo } from './menu.model'
import { MenuService } from './menu.service'

export const permissions: PermissionMap<'system:menu'> = {
  LIST: 'system:menu:list',
  CREATE: 'system:menu:create',
  READ: 'system:menu:read',
  UPDATE: 'system:menu:update',
  DELETE: 'system:menu:delete',
} as const

@ApiTags('System - 菜单权限模块')
@ApiSecurityAuth()
@Controller('menus')
export class MenuController {
  constructor(private menuService: MenuService) {}

  @Get()
  @ApiOperation({ summary: '获取所有菜单列表' })
  @ApiResult({ type: [MenuItemInfo] })
  @Perm(permissions.LIST)
  async list(@Query() dto: MenuQueryDto) {
    return this.menuService.list(dto)
  }

  @Get(':id')
  @ApiOperation({ summary: '获取菜单或权限信息' })
  @Perm(permissions.READ)
  async info(@IdParam() id: number) {
    return this.menuService.getMenuItemAndParentInfo(id)
  }

  @Post()
  @ApiOperation({ summary: '新增菜单或权限' })
  @Perm(permissions.CREATE)
  async create(@Body() dto: MenuDto): Promise<void> {
    // check
    await this.menuService.check(dto)
    if (!dto.parentId)
      dto.parentId = null

    await this.menuService.create(dto)
    if (dto.type === 2) {
      // 如果是权限发生更改，则刷新所有在线用户的权限
      await this.menuService.refreshOnlineUserPerms()
    }
  }

  @Put(':id')
  @ApiOperation({ summary: '更新菜单或权限' })
  @Perm(permissions.UPDATE)
  async update(
    @IdParam() id: number, @Body() dto: MenuUpdateDto): Promise<void> {
    // check
    await this.menuService.check(dto)
    if (dto.parentId === -1 || !dto.parentId)
      dto.parentId = null

    await this.menuService.update(id, dto)
    if (dto.type === 2) {
      // 如果是权限发生更改，则刷新所有在线用户的权限
      await this.menuService.refreshOnlineUserPerms()
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除菜单或权限' })
  @Perm(permissions.DELETE)
  async delete(@IdParam() id: number): Promise<void> {
    if (await this.menuService.checkRoleByMenuId(id))
      throw new BadRequestException('该菜单存在关联角色，无法删除')

    // 如果有子目录，一并删除
    const childMenus = await this.menuService.findChildMenus(id)
    await this.menuService.deleteMenuItem(flattenDeep([id, childMenus]))
    // 刷新在线用户权限
    await this.menuService.refreshOnlineUserPerms()
  }
}
