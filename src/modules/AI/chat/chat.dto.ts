import {IsString, MinLength} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';

export class ChatDto {
    @ApiProperty({description: '消息内容'})
    @MinLength(1)
    @IsString()
    message: string;
}
