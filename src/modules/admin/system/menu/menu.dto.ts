import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
  ValidateIf,
} from 'class-validator';

/**
 * 增加菜单
 */
export class CreateMenuDto {
  @ApiProperty({ description: '菜单类型' })
  @IsIn([0, 1, 2])
  type: number;

  @ApiProperty({ description: '父级菜单' })
  @IsInt()
  parentId: number;

  @ApiProperty({ description: '菜单或权限名称' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ description: '排序' })
  @IsInt()
  @Min(0)
  orderNum: number;

  @ApiProperty({ description: '前端路由地址' })
  @IsString()
  @ValidateIf((o) => o.type !== 2)
  router: string;

  @ApiProperty({ description: '菜单是否显示', required: false, default: true })
  @IsBoolean()
  @ValidateIf((o) => o.type !== 2)
  readonly isShow: boolean = true;

  @ApiProperty({ description: '开启页面缓存', required: false, default: true })
  @IsBoolean()
  @ValidateIf((o) => o.type === 1)
  readonly keepalive: boolean = true;

  @ApiProperty({ description: '菜单图标', required: false })
  @IsString()
  @IsOptional()
  @ValidateIf((o) => o.type !== 2)
  icon: string;

  @ApiProperty({ description: '对应权限' })
  @IsString()
  @IsOptional()
  @ValidateIf((o) => o.type === 2)
  perms: string;

  @ApiProperty({ description: '菜单路由路径或外链' })
  @ValidateIf((o) => o.type !== 2)
  @IsString()
  @IsOptional()
  viewPath: string;
}

export class UpdateMenuDto extends CreateMenuDto {
  @ApiProperty({ description: '更新的菜单ID' })
  @IsInt()
  @Min(0)
  menuId: number;
}

/**
 * 删除菜单
 */
export class DeleteMenuDto {
  @ApiProperty({ description: '删除的菜单ID' })
  @IsInt()
  @Min(0)
  menuId: number;
}

/**
 * 查询菜单
 */
export class InfoMenuDto {
  @ApiProperty({ description: '查询的菜单ID' })
  @IsInt()
  @Min(0)
  @Type(() => Number)
  menuId: number;
}
