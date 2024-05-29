import { ApiProperty, PartialType } from '@nestjs/swagger'
import { IsInt, IsOptional, IsString, MinLength } from 'class-validator'

import { PagerDto } from '~/common/dto/pager.dto'

import { IsUnique } from '~/shared/database/constraints/unique.constraint'

import { DictTypeEntity } from './dict-type.entity'

export class DictTypeDto extends PartialType(DictTypeEntity) {
  @ApiProperty({ description: '字典类型名称' })
  @IsUnique({ entity: DictTypeEntity, message: '已存在相同名称的字典' })
  @IsString()
  @MinLength(1)
  name: string

  @ApiProperty({ description: '字典类型code' })
  @IsUnique({ entity: DictTypeEntity, message: '已存在相同编码的字典' })
  @IsString()
  @MinLength(3)
  code: string

  @ApiProperty({ description: '状态' })
  @IsOptional()
  @IsInt()
  status?: number

  @ApiProperty({ description: '备注' })
  @IsOptional()
  @IsString()
  remark?: string
}

export class DictTypeQueryDto extends PagerDto {
  @ApiProperty({ description: '字典类型名称' })
  @IsString()
  @IsOptional()
  name: string

  @ApiProperty({ description: '字典类型code' })
  @IsString()
  @IsOptional()
  code: string
}
