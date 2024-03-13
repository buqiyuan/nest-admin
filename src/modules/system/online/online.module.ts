import { Module } from '@nestjs/common'

import { AuthModule } from '~/modules/auth/auth.module'

import { UserModule } from '../../user/user.module'

import { OnlineController } from './online.controller'
import { OnlineService } from './online.service'

const providers = [OnlineService]

@Module({
  imports: [
    UserModule,
    AuthModule,
  ],
  controllers: [OnlineController],
  providers,
  exports: [...providers],
})
export class OnlineModule {}
