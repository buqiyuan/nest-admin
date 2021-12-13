import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateParamConfigDto {
  @ApiProperty({ description: '参数名称' })
  @IsString()
  name: string;

  @ApiProperty({ description: '参数键名' })
  @IsString()
  @MinLength(3)
  key: string;

  @ApiProperty({ description: '参数值' })
  @IsString()
  value: string;

  @ApiProperty({ required: false, description: '备注' })
  @IsString()
  @IsOptional()
  remark: string;
}

export class UpdateParamConfigDto {
  @ApiProperty({ description: '配置编号' })
  @IsInt()
  @Min(1)
  id: number;

  @ApiProperty({ description: '参数名称' })
  @IsString()
  name: string;

  @ApiProperty({ description: '参数值' })
  @IsString()
  value: string;

  @ApiProperty({ required: false, description: '备注' })
  @IsString()
  @IsOptional()
  remark: string;
}

export class DeleteParamConfigDto {
  @ApiProperty({ description: '需要删除的配置id列表', type: [Number] })
  @IsArray()
  @ArrayNotEmpty()
  ids: number[];
}

export class InfoParamConfigDto {
  @ApiProperty({ description: '需要查询的配置编号' })
  @IsInt()
  @Min(0)
  @Type(() => Number)
  id: number;
}
