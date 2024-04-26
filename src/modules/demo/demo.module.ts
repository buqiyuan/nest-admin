import { Module } from '@nestjs/common';
import { DemoService } from './demo.service';
import { DemoController } from './demo.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import {DemoEntity} from '~/modules/demo/demo.entity';

const services = [DemoService];

@Module({
  imports: [TypeOrmModule.forFeature([DemoEntity])],
  controllers: [DemoController],
  providers: [...services],
  exports: [TypeOrmModule, ...services],
})
export class DemoModule {}
