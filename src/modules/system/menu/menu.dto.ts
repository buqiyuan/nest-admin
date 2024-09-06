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

enum MenuType {
  /** 菜单 */
  MENU = 0,
  /** 目录 */
  MENU_GROUP = 1,
  /** 权限 */
  PERMISSION = 2,
}

export class MenuDto extends OperatorDto {
  @ApiProperty({
    description: `
菜单类型:
- 0: 菜单
- 1: 目录
- 2: 权限   
    `,
    enum: MenuType,
  })
  @IsIn([0, 1, 2])
  type: MenuType

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
  @ValidateIf(o => o.type !== MenuType.PERMISSION)
  path: string

  @ApiProperty({ description: '是否外链', default: false })
  @ValidateIf(o => o.type !== MenuType.PERMISSION)
  @IsBoolean()
  isExt: boolean

  @ApiProperty({ description: '外链打开方式', default: 1 })
  @ValidateIf((o: MenuDto) => o.isExt)
  @IsIn([1, 2])
  extOpenMode: number

  @ApiProperty({ description: '菜单是否显示', default: 1 })
  @ValidateIf((o: MenuDto) => o.type !== MenuType.PERMISSION)
  @IsIn([0, 1])
  show: number

  @ApiProperty({ description: '设置当前路由高亮的菜单项，一般用于详情页' })
  @ValidateIf((o: MenuDto) => o.type !== MenuType.PERMISSION && o.show === 0)
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
  @ValidateIf((o: MenuDto) => o.type !== MenuType.PERMISSION)
  @IsString()
  icon?: string

  @ApiProperty({ description: '对应权限' })
  @ValidateIf((o: MenuDto) => o.type === MenuType.PERMISSION)
  @IsString()
  @IsOptional()
  permission: string

  @ApiProperty({ description: '菜单路由路径或外链' })
  @ValidateIf((o: MenuDto) => o.type !== MenuType.PERMISSION)
  @IsString()
  @IsOptional()
  component?: string
}

export class MenuUpdateDto extends PartialType(MenuDto) {}

export class MenuQueryDto extends PartialType(MenuDto) {}
