import { Module } from '@nestjs/common';
import { _Controller } from './controller';
import {TypeOrmModule} from '@nestjs/typeorm';
// 定义引用
import { Service } from './service';
import {_Entity as Entity} from './entity';

const services = [Service];

@Module({
  imports: [TypeOrmModule.forFeature([Entity])],
  controllers: [_Controller],
  providers: [...services],
  exports: [TypeOrmModule, ...services],
})
export class XwsbookModule {}
