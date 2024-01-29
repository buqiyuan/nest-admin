import { ApiProperty, IntersectionType, PartialType } from '@nestjs/swagger'
import { IsString } from 'class-validator'

import { PagerDto } from '~/common/dto/pager.dto'

export class TodoDto {
  @ApiProperty({ description: '名称' })
  @IsString()
  value: string
}

export class TodoUpdateDto extends PartialType(TodoDto) {}

export class TodoQueryDto extends IntersectionType(PagerDto, TodoDto) {}
