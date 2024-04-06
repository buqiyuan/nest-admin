import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { sys_role } from './SysRole'

@Entity('sys_menu', { schema: 'mysql' })
export class sys_menu extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number

  @Column('int', { name: 'parent_id', nullable: true })
  parentId: number | null

  @Column('varchar', { name: 'path', nullable: true, length: 255 })
  path: string | null

  @Column('varchar', { name: 'name', length: 255 })
  name: string

  @Column('varchar', { name: 'permission', nullable: true, length: 255 })
  permission: string | null

  @Column('tinyint', { name: 'type', default: () => '\'0\'' })
  type: number

  @Column('varchar', { name: 'icon', nullable: true, length: 255 })
  icon: string | null

  @Column('int', { name: 'order_no', nullable: true, default: () => '\'0\'' })
  orderNo: number | null

  @Column('varchar', { name: 'component', nullable: true, length: 255 })
  component: string | null

  @Column('tinyint', { name: 'keep_alive', default: () => '\'1\'' })
  keepAlive: number

  @Column('tinyint', { name: 'show', default: () => '\'1\'' })
  show: number

  @Column('tinyint', { name: 'status', default: () => '\'1\'' })
  status: number

  @Column('datetime', {
    name: 'created_at',
    default: () => '\'CURRENT_TIMESTAMP(6)\'',
  })
  createdAt: Date

  @Column('datetime', {
    name: 'updated_at',
    default: () => '\'CURRENT_TIMESTAMP(6)\'',
  })
  updatedAt: Date

  @Column('tinyint', { name: 'is_ext', default: () => '\'0\'' })
  isExt: number

  @Column('tinyint', { name: 'ext_open_mode', default: () => '\'1\'' })
  extOpenMode: number

  @Column('varchar', { name: 'active_menu', nullable: true, length: 255 })
  activeMenu: string | null

  @ManyToMany(() => sys_role, sysRole => sysRole.sysMenus)
  @JoinTable({
    name: 'sys_role_menus',
    joinColumns: [{ name: 'menu_id', referencedColumnName: 'id' }],
    inverseJoinColumns: [{ name: 'role_id', referencedColumnName: 'id' }],
    schema: 'mysql',
  })
  sysRoles: sys_role[]
}
