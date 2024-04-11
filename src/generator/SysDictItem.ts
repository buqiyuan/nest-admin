import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { sys_dict_type } from './SysDictType';

@Entity('sys_dict_item', { schema: 'mysql' })
export class sys_dict_item extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('datetime', {
    name: 'created_at',
    default: () => '\'CURRENT_TIMESTAMP(6)\'',
  })
  createdAt: Date;

  @Column('datetime', {
    name: 'updated_at',
    default: () => '\'CURRENT_TIMESTAMP(6)\'',
  })
  updatedAt: Date;

  @Column('int', { name: 'create_by', comment: '创建者' })
  createBy: number;

  @Column('int', { name: 'update_by', comment: '更新者' })
  updateBy: number;

  @Column('varchar', { name: 'label', length: 50 })
  label: string;

  @Column('varchar', { name: 'value', length: 50 })
  value: string;

  @Column('int', { name: 'order', nullable: true, comment: '字典项排序' })
  order: number | null;

  @Column('tinyint', { name: 'status', default: () => '\'1\'' })
  status: number;

  @Column('varchar', { name: 'remark', nullable: true, length: 255 })
  remark: string | null;

  @Column('int', { name: 'orderNo', nullable: true, comment: '字典项排序' })
  orderNo: number | null;

  @ManyToOne(() => sys_dict_type, sysDictType => sysDictType.sysDictItems, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'type_id', referencedColumnName: 'id' }])
  type: sys_dict_type;
}
