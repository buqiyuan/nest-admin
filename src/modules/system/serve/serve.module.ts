import { Module, forwardRef } from '@nestjs/common'

import { SystemModule } from '../system.module'

import { ServeController } from './serve.controller'
import { ServeService } from './serve.service'

const providers = [ServeService]

@Module({
  imports: [forwardRef(() => SystemModule)],
  controllers: [ServeController],
  providers: [...providers],
  exports: [...providers],
})
export class ServeModule {}
