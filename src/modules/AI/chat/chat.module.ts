import {forwardRef, Module} from '@nestjs/common';
import {ChatService} from './chat.service';
import {ChatController} from './chat.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import {XWSEntity} from '~/modules/AI/chat/entity/xws.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([XWSEntity]),
    ],
    controllers: [ChatController],
    providers: [ChatService],
})
export class ChatModule {
}
