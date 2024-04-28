import { Module } from '@nestjs/common';
import { BaseController } from './base.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
// 定义引用
import { Service } from './base.service';
import {_Entity as Entity} from './base.entity';

const services = [Service];

@Module({
  imports: [TypeOrmModule.forFeature([Entity])],
  controllers: [BaseController],
  providers: [...services],
  exports: [TypeOrmModule, ...services],
})
export class BaseModule {}
