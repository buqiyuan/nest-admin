import { Module } from '@nestjs/common';
import { DemoService } from './demo.service';
import { DemoController } from './demo.controller';

@Module({
  controllers: [DemoController],
  providers: [DemoService],
})
export class DemoModule {}
