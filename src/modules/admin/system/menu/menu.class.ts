import { ApiProperty } from '@nestjs/swagger';
import SysMenu from 'src/entities/admin/sys-menu.entity';

export class MenuItemAndParentInfoResult {
  @ApiProperty({ description: '菜单' })
  menu?: SysMenu;

  @ApiProperty({ description: '父级菜单' })
  parentMenu?: SysMenu;
}
