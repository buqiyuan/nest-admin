import { Inject, Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { difference, filter, includes, isEmpty, map } from 'lodash';
import SysRoleDepartment from 'src/entities/admin/sys-role-department.entity';
import SysRoleMenu from 'src/entities/admin/sys-role-menu.entity';
import SysRole from 'src/entities/admin/sys-role.entity';
import SysUserRole from 'src/entities/admin/sys-user-role.entity';
import { EntityManager, In, Not, Repository } from 'typeorm';
import { CreateRoleDto, UpdateRoleDto } from './role.dto';
import { CreatedRoleId, RoleInfo } from './role.class';
import { ROOT_ROLE_ID } from 'src/modules/admin/admin.constants';

@Injectable()
export class SysRoleService {
  constructor(
    @InjectRepository(SysRole) private roleRepository: Repository<SysRole>,
    @InjectRepository(SysRoleMenu)
    private roleMenuRepository: Repository<SysRoleMenu>,
    @InjectRepository(SysRoleDepartment)
    private roleDepartmentRepository: Repository<SysRoleDepartment>,
    @InjectRepository(SysUserRole)
    private userRoleRepository: Repository<SysUserRole>,
    @InjectEntityManager() private entityManager: EntityManager,
    @Inject(ROOT_ROLE_ID) private rootRoleId: number,
  ) {}

  /**
   * 列举所有角色：除去超级管理员
   */
  async list(): Promise<SysRole[]> {
    const result = await this.roleRepository.find({
      id: Not(this.rootRoleId),
    });
    return result;
  }

  /**
   * 列举所有角色条数：除去超级管理员
   */
  async count(): Promise<number> {
    const count = await this.roleRepository.count({
      id: Not(this.rootRoleId),
    });
    return count;
  }

  /**
   * 根据角色获取角色信息
   */
  async info(rid: number): Promise<RoleInfo> {
    const roleInfo = await this.roleRepository.findOne({ id: rid });
    const menus = await this.roleMenuRepository.find({ roleId: rid });
    const depts = await this.roleDepartmentRepository.find({ roleId: rid });
    return { roleInfo, menus, depts };
  }

  /**
   * 根据角色Id数组删除
   */
  async delete(roleIds: number[]): Promise<void> {
    if (includes(roleIds, this.rootRoleId)) {
      throw new Error('Not Support Delete Root');
    }
    await this.entityManager.transaction(async (manager) => {
      await manager.delete(SysRole, roleIds);
      await manager.delete(SysRoleMenu, { roleId: In(roleIds) });
      await manager.delete(SysRoleDepartment, { roleId: In(roleIds) });
    });
  }

  /**
   * 增加角色
   */
  async add(param: CreateRoleDto, uid: number): Promise<CreatedRoleId> {
    const { name, label, remark, menus, depts } = param;
    const role = await this.roleRepository.insert({
      name,
      label,
      remark,
      userId: `${uid}`,
    });
    const { identifiers } = role;
    const roleId = parseInt(identifiers[0].id);
    if (menus && menus.length > 0) {
      // 关联菜单
      const insertRows = menus.map((m) => {
        return {
          roleId,
          menuId: m,
        };
      });
      await this.roleMenuRepository.insert(insertRows);
    }
    if (depts && depts.length > 0) {
      // 关联部门
      const insertRows = depts.map((d) => {
        return {
          roleId,
          departmentId: d,
        };
      });
      await this.roleDepartmentRepository.insert(insertRows);
    }
    return { roleId };
  }

  /**
   * 更新角色信息
   */
  async update(param: UpdateRoleDto): Promise<SysRole> {
    const { roleId, name, label, remark, menus, depts } = param;
    const role = await this.roleRepository.save({
      id: roleId,
      name,
      label,
      remark,
    });
    const originDeptRows = await this.roleDepartmentRepository.find({ roleId });
    const originMenuRows = await this.roleMenuRepository.find({ roleId });
    const originMenuIds = originMenuRows.map((e) => {
      return e.menuId;
    });
    const originDeptIds = originDeptRows.map((e) => {
      return e.departmentId;
    });
    // 开始对比差异
    const insertMenusRowIds = difference(menus, originMenuIds);
    const deleteMenusRowIds = difference(originMenuIds, menus);
    const insertDeptRowIds = difference(depts, originDeptIds);
    const deleteDeptRowIds = difference(originDeptIds, depts);
    // using transaction
    await this.entityManager.transaction(async (manager) => {
      // 菜单
      if (insertMenusRowIds.length > 0) {
        // 有条目更新
        const insertRows = insertMenusRowIds.map((e) => {
          return {
            roleId,
            menuId: e,
          };
        });
        await manager.insert(SysRoleMenu, insertRows);
      }
      if (deleteMenusRowIds.length > 0) {
        // 有条目需要删除
        const realDeleteRowIds = filter(originMenuRows, (e) => {
          return includes(deleteMenusRowIds, e.menuId);
        }).map((e) => {
          return e.id;
        });
        await manager.delete(SysRoleMenu, realDeleteRowIds);
      }
      // 部门
      if (insertDeptRowIds.length > 0) {
        // 有条目更新
        const insertRows = insertDeptRowIds.map((e) => {
          return {
            roleId,
            departmentId: e,
          };
        });
        await manager.insert(SysRoleDepartment, insertRows);
      }
      if (deleteDeptRowIds.length > 0) {
        // 有条目需要删除
        const realDeleteRowIds = filter(originDeptRows, (e) => {
          return includes(deleteDeptRowIds, e.departmentId);
        }).map((e) => {
          return e.id;
        });
        await manager.delete(SysRoleDepartment, realDeleteRowIds);
      }
    });
    return role;
  }

  /**
   * 分页加载角色信息
   */
  async page(page: number, count: number): Promise<SysRole[]> {
    const result = await this.roleRepository.find({
      where: {
        id: Not(this.rootRoleId),
      },
      order: {
        id: 'ASC',
      },
      take: count,
      skip: page * count,
    });
    return result;
  }

  /**
   * 根据用户id查找角色信息
   */
  async getRoleIdByUser(id: number): Promise<number[]> {
    const result = await this.userRoleRepository.find({
      where: {
        userId: id,
      },
    });
    if (!isEmpty(result)) {
      return map(result, (v) => {
        return v.roleId;
      });
    }
    return [];
  }

  /**
   * 根据角色ID列表查找关联用户ID
   */
  async countUserIdByRole(ids: number[]): Promise<number | never> {
    if (includes(ids, this.rootRoleId)) {
      throw new Error('Not Support Delete Root');
    }
    return await this.userRoleRepository.count({ roleId: In(ids) });
  }
}
