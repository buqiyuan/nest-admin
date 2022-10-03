import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import SysUserRole from 'src/entities/admin/sys-user-role.entity';
import SysRoleMenu from 'src/entities/admin/sys-role-menu.entity';
import { AdminWSGateway } from './admin-ws.gateway';
import { AuthService } from './auth.service';
import { AdminWSService } from './admin-ws.service';

const providers = [AdminWSGateway, AuthService, AdminWSService];

/**
 * WebSocket Module
 */
@Module({
  imports: [TypeOrmModule.forFeature([SysUserRole, SysRoleMenu])],
  providers,
  exports: providers,
})
export class WSModule {}
