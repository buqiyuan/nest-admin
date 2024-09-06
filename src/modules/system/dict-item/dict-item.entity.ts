import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'

import { CompleteEntity } from '~/common/entity/common.entity'

import { DictTypeEntity } from '../dict-type/dict-type.entity'

@Entity({ name: 'sys_dict_item' })
export class DictItemEntity extends CompleteEntity {
  @ManyToOne(() => DictTypeEntity, { cascade: true, createForeignKeyConstraints: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'type_id' })
  type: DictTypeEntity

  @Column({ type: 'varchar', length: 50 })
  @ApiProperty({ description: '字典项键名' })
  label: string

  @Column({ type: 'varchar', length: 50 })
  @ApiProperty({ description: '字典项值' })
  value: string

  @Column({ nullable: true, comment: '字典项排序' })
  orderNo: number

  @Column({ type: 'tinyint', default: 1 })
  @ApiProperty({ description: ' 状态' })
  status: number

  @Column({ type: 'varchar', nullable: true })
  @ApiProperty({ description: '备注' })
  remark: string
}
