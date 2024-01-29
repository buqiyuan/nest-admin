import { ApiProperty, PartialType } from '@nestjs/swagger'
import { IsInt, IsOptional, IsString, MinLength } from 'class-validator'

import { PagerDto } from '~/common/dto/pager.dto'

import { DictItemEntity } from './dict-item.entity'

export class DictItemDto extends PartialType(DictItemEntity) {
  @ApiProperty({ description: '字典类型 ID' })
  @IsInt()
  typeId: number

  @ApiProperty({ description: '字典项键名' })
  @IsString()
  @MinLength(1)
  label: string

  @ApiProperty({ description: '字典项值' })
  @IsString()
  @MinLength(1)
  value: string

  @ApiProperty({ description: '状态' })
  @IsOptional()
  @IsInt()
  status?: number

  @ApiProperty({ description: '备注' })
  @IsOptional()
  @IsString()
  remark?: string
}

export class DictItemQueryDto extends PagerDto {
  @ApiProperty({ description: '字典类型 ID', required: true })
  @IsInt()
  typeId: number

  @ApiProperty({ description: '字典项键名' })
  @IsString()
  @IsOptional()
  label?: string

  @ApiProperty({ description: '字典项值' })
  @IsString()
  @IsOptional()
  value?: string
}
