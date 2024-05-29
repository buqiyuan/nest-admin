import { Column, Entity, ManyToMany, Relation } from 'typeorm'

import { CompleteEntity } from '~/common/entity/common.entity'

import { RoleEntity } from '../role/role.entity'

@Entity({ name: 'sys_menu' })
export class MenuEntity extends CompleteEntity {
  @Column({ name: 'parent_id', nullable: true })
  parentId: number

  @Column()
  name: string

  @Column({ nullable: true })
  path: string

  @Column({ nullable: true })
  permission: string

  @Column({ type: 'tinyint', default: 0 })
  type: number

  @Column({ nullable: true, default: '' })
  icon: string

  @Column({ name: 'order_no', type: 'int', nullable: true, default: 0 })
  orderNo: number

  @Column({ name: 'component', nullable: true })
  component: string

  @Column({ name: 'is_ext', type: 'boolean', default: false })
  isExt: boolean

  @Column({ name: 'ext_open_mode', type: 'tinyint', default: 1 })
  extOpenMode: number

  @Column({ name: 'keep_alive', type: 'tinyint', default: 1 })
  keepAlive: number

  @Column({ type: 'tinyint', default: 1 })
  show: number

  @Column({ name: 'active_menu', nullable: true })
  activeMenu: string

  @Column({ type: 'tinyint', default: 1 })
  status: number

  @ManyToMany(() => RoleEntity, role => role.menus, {
    onDelete: 'CASCADE',
  })
  roles: Relation<RoleEntity[]>
}
