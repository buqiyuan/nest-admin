import { ApiHideProperty, ApiProperty } from '@nestjs/swagger'
import { Column, Entity, JoinTable, ManyToMany, Relation } from 'typeorm'

import { CompleteEntity } from '~/common/entity/common.entity'

import { UserEntity } from '../../user/user.entity'
import { MenuEntity } from '../menu/menu.entity'

@Entity({ name: 'sys_role' })
export class RoleEntity extends CompleteEntity {
  @Column({ length: 50, unique: true })
  @ApiProperty({ description: '角色名' })
  name: string

  @Column({ unique: true, comment: '角色标识' })
  @ApiProperty({ description: '角色标识' })
  value: string

  @Column({ nullable: true })
  @ApiProperty({ description: '角色描述' })
  remark: string

  @Column({ type: 'tinyint', nullable: true, default: 1 })
  @ApiProperty({ description: '状态：1启用，0禁用' })
  status: number

  @Column({ nullable: true })
  @ApiProperty({ description: '是否默认用户' })
  default: boolean

  @ApiHideProperty()
  @ManyToMany(() => UserEntity, user => user.roles)
  users: Relation<UserEntity[]>

  @ApiHideProperty()
  @ManyToMany(() => MenuEntity, menu => menu.roles, {})
  @JoinTable({
    name: 'sys_role_menus',
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'menu_id', referencedColumnName: 'id' },
  })
  menus: Relation<MenuEntity[]>
}
