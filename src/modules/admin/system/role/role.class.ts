import { ApiProperty } from '@nestjs/swagger';
import SysRoleDepartment from 'src/entities/admin/sys-role-department.entity';
import SysRoleMenu from 'src/entities/admin/sys-role-menu.entity';
import SysRole from 'src/entities/admin/sys-role.entity';

export class RoleInfo {
  @ApiProperty({
    type: SysRole,
  })
  roleInfo: SysRole;

  @ApiProperty({
    type: [SysRoleMenu],
  })
  menus: SysRoleMenu[];

  @ApiProperty({
    type: [SysRoleDepartment],
  })
  depts: SysRoleDepartment[];
}

export class CreatedRoleId {
  roleId: number;
}
