import { Module } from '@nestjs/common'

import { OnlineModule } from '../system/online/online.module'

import { SseController } from './sse.controller'
import { SseService } from './sse.service'

@Module({
  imports: [OnlineModule],
  controllers: [SseController],
  providers: [SseService],
  exports: [SseService],
})
export class SseModule {}
