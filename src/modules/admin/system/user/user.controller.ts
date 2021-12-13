import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { PageResult } from 'src/common/class/res.class';
import { ADMIN_PREFIX } from '../../admin.constants';
import { IAdminUser } from '../../admin.interface';
import { AdminUser } from '../../core/decorators/admin-user.decorator';
import {
  CreateUserDto,
  DeleteUserDto,
  InfoUserDto,
  PageSearchUserDto,
  PasswordUserDto,
  UpdateUserDto,
} from './user.dto';
import { PageSearchUserInfo, UserDetailInfo } from './user.class';
import { SysUserService } from './user.service';
import { SysMenuService } from '../menu/menu.service';

@ApiSecurity(ADMIN_PREFIX)
@ApiTags('管理员模块')
@Controller('user')
export class SysUserController {
  constructor(
    private userService: SysUserService,
    private menuService: SysMenuService,
  ) {}

  @ApiOperation({
    summary: '新增管理员',
  })
  @Post('add')
  async add(@Body() dto: CreateUserDto): Promise<void> {
    await this.userService.add(dto);
  }

  @ApiOperation({
    summary: '查询管理员信息',
  })
  @ApiOkResponse({ type: UserDetailInfo })
  @Get('info')
  async info(@Query() dto: InfoUserDto): Promise<UserDetailInfo> {
    return await this.userService.info(dto.userId);
  }

  @ApiOperation({
    summary: '根据ID列表删除管理员',
  })
  @Post('delete')
  async delete(@Body() dto: DeleteUserDto): Promise<void> {
    await this.userService.delete(dto.userIds);
    await this.userService.multiForbidden(dto.userIds);
  }

  @ApiOperation({
    summary: '分页获取管理员列表',
  })
  @ApiOkResponse({ type: [PageSearchUserInfo] })
  @Post('page')
  async page(
    @Body() dto: PageSearchUserDto,
    @AdminUser() user: IAdminUser,
  ): Promise<PageResult<PageSearchUserInfo>> {
    const list = await this.userService.page(
      user.uid,
      dto.departmentIds,
      dto.page - 1,
      dto.limit,
    );
    const total = await this.userService.count(user.uid, dto.departmentIds);
    return {
      list,
      pagination: {
        total,
        page: dto.page,
        size: dto.limit,
      },
    };
  }

  @ApiOperation({
    summary: '更新管理员信息',
  })
  @Post('update')
  async update(@Body() dto: UpdateUserDto): Promise<void> {
    await this.userService.update(dto);
    await this.menuService.refreshPerms(dto.id);
  }

  @ApiOperation({
    summary: '更改指定管理员密码',
  })
  @Post('password')
  async password(@Body() dto: PasswordUserDto): Promise<void> {
    await this.userService.forceUpdatePassword(dto.userId, dto.password);
  }
}
