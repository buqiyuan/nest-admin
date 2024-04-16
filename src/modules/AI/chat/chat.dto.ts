import {IsNumber, IsObject, IsOptional, IsString, MinLength, ValidateNested} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';
import {Type} from 'class-transformer';

export class OptionsObject {
    @IsNumber()
    number: number;

    @IsString()
    type: string;
}

export class ChatDto {
    @ApiProperty({description: '消息内容'})
    @MinLength(1)
    @IsString()
    message: string;

    @ApiProperty({description: '对话初始选项'})
    @ValidateNested()
    @Type(() => OptionsObject)
    optionsObj: OptionsObject;
}
