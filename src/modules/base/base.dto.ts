import {ApiPropertyOptional, IntersectionType, PartialType} from '@nestjs/swagger';
import {IsString, MaxLength, MinLength} from 'class-validator';
import {PagerDto} from '~/common/dto/pager.dto';

/**
 * 创建DTO
 */
export class Dto {
    @ApiPropertyOptional({ description: '名字' })
    @IsString()
    @MinLength(2)
    @MaxLength(50)
    name:string;
}

/**
 * 更新DTO
 * Dto字段可选化
 */
export class UpdateDto extends PartialType(Dto) {}

/**
 * 查询DTO
 * DTO字段可选，分页化
 */
export class QueryDto extends IntersectionType(PagerDto, PartialType(Dto)) {}
