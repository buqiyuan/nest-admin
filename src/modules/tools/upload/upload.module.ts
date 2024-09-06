import { forwardRef, Module } from '@nestjs/common'

import { StorageModule } from '../storage/storage.module'

import { UploadController } from './upload.controller'
import { UploadService } from './upload.service'

const services = [UploadService]

@Module({
  imports: [forwardRef(() => StorageModule)],
  controllers: [UploadController],
  providers: [...services],
  exports: [...services],
})
export class UploadModule {}
