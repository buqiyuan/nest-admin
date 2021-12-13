import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class KickDto {
  @ApiProperty({ description: '需要下线的角色ID' })
  @IsInt()
  id: number;
}
