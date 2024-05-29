import { ApiProperty, PartialType } from '@nestjs/swagger'
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
  ValidateIf,
} from 'class-validator'

import { OperatorDto } from '~/common/dto/operator.dto'

export class MenuDto extends OperatorDto {
  @ApiProperty({ description: '菜单类型' })
  @IsIn([0, 1, 2])
  type: number

  @ApiProperty({ description: '父级菜单' })
  @IsOptional()
  parentId: number

  @ApiProperty({ description: '菜单或权限名称' })
  @IsString()
  @MinLength(2)
  name: string

  @ApiProperty({ description: '排序' })
  @IsInt()
  @Min(0)
  orderNo: number

  @ApiProperty({ description: '前端路由地址' })
  // @Matches(/^[/]$/)
  @ValidateIf(o => o.type !== 2)
  path: string

  @ApiProperty({ description: '是否外链', default: false })
  @ValidateIf(o => o.type !== 2)
  @IsBoolean()
  isExt: boolean

  @ApiProperty({ description: '外链打开方式', default: 1 })
  @ValidateIf((o: MenuDto) => o.isExt)
  @IsIn([1, 2])
  extOpenMode: number

  @ApiProperty({ description: '菜单是否显示', default: 1 })
  @ValidateIf((o: MenuDto) => o.type !== 2)
  @IsIn([0, 1])
  show: number

  @ApiProperty({ description: '设置当前路由高亮的菜单项，一般用于详情页' })
  @ValidateIf((o: MenuDto) => o.type !== 2 && o.show === 0)
  @IsString()
  @IsOptional()
  activeMenu?: string

  @ApiProperty({ description: '是否开启页面缓存', default: 1 })
  @ValidateIf((o: MenuDto) => o.type === 1)
  @IsIn([0, 1])
  keepAlive: number

  @ApiProperty({ description: '状态', default: 1 })
  @IsIn([0, 1])
  status: number

  @ApiProperty({ description: '菜单图标' })
  @IsOptional()
  @ValidateIf((o: MenuDto) => o.type !== 2)
  @IsString()
  icon?: string

  @ApiProperty({ description: '对应权限' })
  @ValidateIf((o: MenuDto) => o.type === 2)
  @IsString()
  @IsOptional()
  permission: string

  @ApiProperty({ description: '菜单路由路径或外链' })
  @ValidateIf((o: MenuDto) => o.type !== 2)
  @IsString()
  @IsOptional()
  component?: string
}

export class MenuUpdateDto extends PartialType(MenuDto) {}

export class MenuQueryDto extends PartialType(MenuDto) {}
