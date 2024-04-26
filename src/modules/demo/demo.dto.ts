import {ApiPropertyOptional, IntersectionType, PartialType} from '@nestjs/swagger';
import {IsString, MaxLength, MinLength} from 'class-validator';
import {PagerDto} from '~/common/dto/pager.dto';

export class DemoDto {
    @ApiPropertyOptional({ description: '名字' })
    @IsString()
    @MinLength(2)
    @MaxLength(50)
    name:string;
}

export class DemoUpdateDto extends PartialType(DemoDto) {}

export class DemoQueryDto extends IntersectionType(PagerDto, PartialType(DemoDto)) {}
