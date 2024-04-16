import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards} from '@nestjs/common';
import { ChatService } from './chat.service';
import {ChatDto} from '~/modules/AI/chat/chat.dto';
import {ApiSecurityAuth} from '~/common/decorators/swagger.decorator';
import {ApiOperation, ApiTags} from '@nestjs/swagger';
import {LocalGuard} from '~/modules/auth/guards/local.guard';
import {Public} from '~/modules/auth/decorators/public.decorator';

@ApiTags('AI - 对话模块')
@UseGuards(LocalGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @Public()
  @ApiOperation({ summary: '发起对话' })
  talk(@Body() chatDto: ChatDto) {
    return this.chatService.chat(chatDto);
  }

  @Post('test')
  @Public()
  @ApiOperation({ summary: '发起对话' })
  test(@Body() chatDto: ChatDto) {
    return this.chatService.talktest(chatDto);
  }
}
