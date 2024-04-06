import {
  BaseEntity,
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { sys_dict_item } from './SysDictItem'

@Index('IDX_74d0045ff7fab9f67adc0b1bda', ['code'], { unique: true })
@Entity('sys_dict_type', { schema: 'mysql' })
export class sys_dict_type extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number

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

  @Column('int', { name: 'create_by', comment: '创建者' })
  createBy: number

  @Column('int', { name: 'update_by', comment: '更新者' })
  updateBy: number

  @Column('varchar', { name: 'name', length: 50 })
  name: string

  @Column('tinyint', { name: 'status', default: () => '\'1\'' })
  status: number

  @Column('varchar', { name: 'remark', nullable: true, length: 255 })
  remark: string | null

  @Column('varchar', { name: 'code', unique: true, length: 50 })
  code: string

  @OneToMany(() => sys_dict_item, sysDictItem => sysDictItem.type)
  sysDictItems: sys_dict_item[]
}
