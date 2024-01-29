import { Module } from '@nestjs/common'

import { SseController } from './sse.controller'
import { SseService } from './sse.service'

@Module({
  imports: [],
  controllers: [SseController],
  providers: [SseService],
  exports: [SseService],
})
export class SseModule {}
