import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { concat, includes, isEmpty, uniq } from 'lodash';
import { ROOT_ROLE_ID } from 'src/modules/admin/admin.constants';
import { ApiException } from 'src/common/exceptions/api.exception';
import SysMenu from 'src/entities/admin/sys-menu.entity';
import { IsNull, Not, Repository } from 'typeorm';
import { SysRoleService } from '../role/role.service';
import { MenuItemAndParentInfoResult } from './menu.class';
import { CreateMenuDto } from './menu.dto';
import { RedisService } from 'src/shared/services/redis.service';

@Injectable()
export class SysMenuService {
  constructor(
    @InjectRepository(SysMenu) private menuRepository: Repository<SysMenu>,
    private redisService: RedisService,
    @Inject(ROOT_ROLE_ID) private rootRoleId: number,
    private roleService: SysRoleService,
  ) {}

  /**
   * 获取所有菜单
   */
  async list(): Promise<SysMenu[]> {
    return await this.menuRepository.find();
  }

  /**
   * 保存或新增菜单
   */
  async save(menu: CreateMenuDto & { id?: number }): Promise<void> {
    await this.menuRepository.save(menu);
  }

  /**
   * 根据角色获取所有菜单
   */
  async getMenus(uid: number): Promise<SysMenu[]> {
    const roleIds = await this.roleService.getRoleIdByUser(uid);
    let menus: SysMenu[] = [];
    if (includes(roleIds, this.rootRoleId)) {
      // root find all
      menus = await this.menuRepository.find();
    } else {
      // [ 1, 2, 3 ] role find
      menus = await this.menuRepository
        .createQueryBuilder('menu')
        .innerJoinAndSelect(
          'sys_role_menu',
          'role_menu',
          'menu.id = role_menu.menu_id',
        )
        .andWhere('role_menu.role_id IN (:...roldIds)', { roldIds: roleIds })
        .orderBy('menu.order_num', 'DESC')
        .getMany();
    }
    return menus;
  }

  /**
   * 检查菜单创建规则是否符合
   */
  async check(dto: CreateMenuDto): Promise<void | never> {
    if (dto.type === 2 && dto.parentId === -1) {
      // 无法直接创建权限，必须有ParentId
      throw new ApiException(10005);
    }
    if (dto.type === 1 && dto.parentId !== -1) {
      const parent = await this.getMenuItemInfo(dto.parentId);
      if (isEmpty(parent)) {
        throw new ApiException(10014);
      }
      if (parent && parent.type === 1) {
        // 当前新增为菜单但父节点也为菜单时为非法操作
        throw new ApiException(10006);
      }
    }
  }

  /**
   * 查找当前菜单下的子菜单，目录以及菜单
   */
  async findChildMenus(mid: number): Promise<any> {
    const allMenus: any = [];
    const menus = await this.menuRepository.find({ parentId: mid });
    // if (_.isEmpty(menus)) {
    //   return allMenus;
    // }
    // const childMenus: any = [];
    for (let i = 0; i < menus.length; i++) {
      if (menus[i].type !== 2) {
        // 子目录下是菜单或目录，继续往下级查找
        const c = await this.findChildMenus(menus[i].id);
        allMenus.push(c);
      }
      allMenus.push(menus[i].id);
    }
    return allMenus;
  }

  /**
   * 获取某个菜单的信息
   * @param mid menu id
   */
  async getMenuItemInfo(mid: number): Promise<SysMenu> {
    const menu = await this.menuRepository.findOne({ id: mid });
    return menu;
  }

  /**
   * 获取某个菜单以及关联的父菜单的信息
   */
  async getMenuItemAndParentInfo(
    mid: number,
  ): Promise<MenuItemAndParentInfoResult> {
    const menu = await this.menuRepository.findOne({ id: mid });
    let parentMenu: SysMenu | undefined = undefined;
    if (menu && menu.parentId) {
      parentMenu = await this.menuRepository.findOne({ id: menu.parentId });
    }
    return { menu, parentMenu };
  }

  /**
   * 查找节点路由是否存在
   */
  async findRouterExist(router: string): Promise<boolean> {
    const menus = await this.menuRepository.findOne({ router });
    return !isEmpty(menus);
  }

  /**
   * 获取当前用户的所有权限
   */
  async getPerms(uid: number): Promise<string[]> {
    const roleIds = await this.roleService.getRoleIdByUser(uid);
    let perms: any[] = [];
    let result: any = null;
    if (includes(roleIds, this.rootRoleId)) {
      // root find all perms
      result = await this.menuRepository.find({
        perms: Not(IsNull()),
        type: 2,
      });
    } else {
      result = await this.menuRepository
        .createQueryBuilder('menu')
        .innerJoinAndSelect(
          'sys_role_menu',
          'role_menu',
          'menu.id = role_menu.menu_id',
        )
        .andWhere('role_menu.role_id IN (:...roldIds)', { roldIds: roleIds })
        .andWhere('menu.type = 2')
        .andWhere('menu.perms IS NOT NULL')
        .getMany();
    }
    if (!isEmpty(result)) {
      result.forEach((e) => {
        perms = concat(perms, e.perms.split(','));
      });
      perms = uniq(perms);
    }
    return perms;
  }

  /**
   * 删除多项菜单
   */
  async deleteMenuItem(mids: number[]): Promise<void> {
    await this.menuRepository.delete(mids);
  }

  /**
   * 刷新指定用户ID的权限
   */
  async refreshPerms(uid: number): Promise<void> {
    const perms = await this.getPerms(uid);
    const online = await this.redisService.getRedis().get(`admin:token:${uid}`);
    if (online) {
      // 判断是否在线
      await this.redisService
        .getRedis()
        .set(`admin:perms:${uid}`, JSON.stringify(perms));
    }
  }

  /**
   * 刷新所有在线用户的权限
   */
  async refreshOnlineUserPerms(): Promise<void> {
    const onlineUserIds: string[] = await this.redisService
      .getRedis()
      .keys('admin:token:*');
    if (onlineUserIds && onlineUserIds.length > 0) {
      for (let i = 0; i < onlineUserIds.length; i++) {
        const uid = onlineUserIds[i].split('admin:token:')[1];
        const perms = await this.getPerms(parseInt(uid));
        await this.redisService
          .getRedis()
          .set(`admin:perms:${uid}`, JSON.stringify(perms));
      }
    }
  }
}
