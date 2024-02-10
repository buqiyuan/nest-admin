import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UserEntity } from '~/modules/user/user.entity'

import { StorageController } from './storage.controller'
import { Storage } from './storage.entity'
import { StorageService } from './storage.service'

const services = [StorageService]

@Module({
  imports: [TypeOrmModule.forFeature([Storage, UserEntity])],
  controllers: [StorageController],
  providers: [...services],
  exports: [TypeOrmModule, ...services],
})
export class StorageModule {}
