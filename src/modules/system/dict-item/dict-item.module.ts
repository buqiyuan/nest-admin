import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { DictItemController } from './dict-item.controller'
import { DictItemEntity } from './dict-item.entity'
import { DictItemService } from './dict-item.service'

const services = [DictItemService]

@Module({
  imports: [TypeOrmModule.forFeature([DictItemEntity])],
  controllers: [DictItemController],
  providers: [...services],
  exports: [TypeOrmModule, ...services],
})
export class DictItemModule {}
