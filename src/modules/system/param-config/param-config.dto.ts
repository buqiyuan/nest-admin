import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString, MinLength } from 'class-validator'

import { PagerDto } from '~/common/dto/pager.dto'
import { IsUnique } from '~/shared/database/constraints/unique.constraint'

import { ParamConfigEntity } from './param-config.entity'

export class ParamConfigDto {
  @ApiProperty({ description: '参数名称' })
  @IsString()
  name: string

  @ApiProperty({ description: '参数键名' })
  @IsUnique({ entity: ParamConfigEntity, message: '该键名已存在' })
  @IsString()
  @MinLength(3)
  key: string

  @ApiProperty({ description: '参数值' })
  @IsString()
  value: string

  @ApiProperty({ description: '备注' })
  @IsOptional()
  @IsString()
  remark?: string
}

export class ParamConfigQueryDto extends PagerDto {
  @ApiProperty({ description: '参数名称' })
  @IsString()
  @IsOptional()
  name: string
}
