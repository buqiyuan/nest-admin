import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString, MinLength } from 'class-validator'
import { Column, Entity } from 'typeorm'

import { CommonEntity } from '~/common/entity/common.entity'

@Entity('car', { schema: 'mysql' })
export class car extends CommonEntity {
  @ApiProperty({ description: '汽车名' })
  @IsString()
  @MinLength(2)
  @Column('varchar', { name: 'car_name', comment: '汽车名', length: 255 })
  carName: string

  @ApiProperty({ description: '备注' })
  @IsOptional()
  @Column('varchar', {
    name: 'remark',
    nullable: true,
    comment: '备注',
    length: 255,
  })
  remark: string | null
}
