import { ApiProperty, PartialType } from '@nestjs/swagger'
import {
  IsArray,
  IsIn,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator'

export class RoleDto {
  @ApiProperty({ description: '角色名称' })
  @IsString()
  @MinLength(2, { message: '角色名称长度不能小于2' })
  name: string

  @ApiProperty({ description: '角色值' })
  @IsString()
  @Matches(/^[a-z0-9A-Z]+$/, { message: '角色值只能包含字母和数字' })
  @MinLength(2, { message: '角色值长度不能小于2' })
  value: string

  @ApiProperty({ description: '角色备注' })
  @IsString()
  @IsOptional()
  remark?: string

  @ApiProperty({ description: '状态' })
  @IsIn([0, 1])
  status: number

  @ApiProperty({ description: '关联菜单、权限编号' })
  @IsOptional()
  @IsArray()
  menuIds?: number[]
}

export class RoleUpdateDto extends PartialType(RoleDto) {}
