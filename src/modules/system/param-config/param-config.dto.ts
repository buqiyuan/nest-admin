import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

import { PagerDto } from '~/common/dto/pager.dto';

export class ParamConfigDto {
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

  @ApiProperty({ description: '备注' })
  @IsOptional()
  @IsString()
  remark?: string;
}

export class ParamConfigQueryDto extends PagerDto {
  @ApiProperty({ description: '参数名称' })
  @IsString()
  @IsOptional()
  name: string;
}
