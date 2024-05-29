import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity } from 'typeorm'

import { CompleteEntity } from '~/common/entity/common.entity'

@Entity({ name: 'sys_dict_type' })
export class DictTypeEntity extends CompleteEntity {
  @Column({ type: 'varchar', length: 50 })
  @ApiProperty({ description: '字典名称' })
  name: string

  @Column({ type: 'varchar', length: 50, unique: true })
  @ApiProperty({ description: '字典编码' })
  code: string

  @Column({ type: 'tinyint', default: 1 })
  @ApiProperty({ description: ' 状态' })
  status: number

  @Column({ type: 'varchar', nullable: true })
  @ApiProperty({ description: '备注' })
  remark: string
}
