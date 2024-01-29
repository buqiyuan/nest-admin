import { Module, type Provider } from '@nestjs/common'

import { TypeOrmModule } from '@nestjs/typeorm'

import { UserEntity } from '../user/user.entity'

import { EmailController } from './email/email.controller'
import { StorageController } from './storage/storage.controller'

import { Storage } from './storage/storage.entity'
import { StorageService } from './storage/storage.service'
import { UploadController } from './upload/upload.controller'
import { UploadService } from './upload/upload.service'

const providers: Provider[] = [StorageService, UploadService]

@Module({
  imports: [TypeOrmModule.forFeature([Storage, UserEntity])],
  controllers: [EmailController, StorageController, UploadController],
  providers,
  exports: [TypeOrmModule, ...providers],
})
export class ToolsModule {}
