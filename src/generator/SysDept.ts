import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { sys_user } from './SysUser'

@Entity('sys_dept', { schema: 'mysql' })
export class sys_dept extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number

  @Column('varchar', { name: 'name', length: 255 })
  name: string

  @Column('int', { name: 'orderNo', nullable: true, default: () => '\'0\'' })
  orderNo: number | null

  @Column('varchar', { name: 'mpath', nullable: true, length: 255 })
  mpath: string | null

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

  @ManyToOne(() => sys_dept, sysDept => sysDept.sysDepts, {
    onDelete: 'SET NULL',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'parentId', referencedColumnName: 'id' }])
  parent: sys_dept

  @OneToMany(() => sys_dept, sysDept => sysDept.parent)
  sysDepts: sys_dept[]

  @OneToMany(() => sys_user, sysUser => sysUser.dept)
  sysUsers: sys_user[]
}
