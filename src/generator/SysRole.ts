import {
  BaseEntity,
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { sys_menu } from './SysMenu'
import { sys_user } from './SysUser'

@Index('IDX_05edc0a51f41bb16b7d8137da9', ['value'], { unique: true })
@Index('IDX_223de54d6badbe43a5490450c3', ['name'], { unique: true })
@Entity('sys_role', { schema: 'mysql' })
export class sys_role extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number

  @Column('varchar', { name: 'value', unique: true, length: 255 })
  value: string

  @Column('varchar', { name: 'name', unique: true, length: 50 })
  name: string

  @Column('varchar', { name: 'remark', nullable: true, length: 255 })
  remark: string | null

  @Column('tinyint', { name: 'status', nullable: true, default: () => '\'1\'' })
  status: number | null

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

  @Column('tinyint', { name: 'default', nullable: true })
  default: number | null

  @ManyToMany(() => sys_menu, sysMenu => sysMenu.sysRoles)
  sysMenus: sys_menu[]

  @ManyToMany(() => sys_user, sysUser => sysUser.sysRoles)
  @JoinTable({
    name: 'sys_user_roles',
    joinColumns: [{ name: 'role_id', referencedColumnName: 'id' }],
    inverseJoinColumns: [{ name: 'user_id', referencedColumnName: 'id' }],
    schema: 'mysql',
  })
  sysUsers: sys_user[]
}
