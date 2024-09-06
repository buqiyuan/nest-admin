import { forwardRef, Module } from '@nestjs/common'

import { AuthModule } from '~/modules/auth/auth.module'

import { SseModule } from '~/modules/sse/sse.module'

import { UserModule } from '../../user/user.module'

import { OnlineController } from './online.controller'
import { OnlineService } from './online.service'

const providers = [OnlineService]

@Module({
  imports: [
    UserModule,
    AuthModule,
    forwardRef(() => SseModule),
  ],
  controllers: [OnlineController],
  providers,
  exports: [...providers],
})
export class OnlineModule {}
