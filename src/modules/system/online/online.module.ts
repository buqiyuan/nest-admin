import { Module, forwardRef } from '@nestjs/common'

import { AuthModule } from '~/modules/auth/auth.module'
import { SocketModule } from '~/socket/socket.module'

import { UserModule } from '../../user/user.module'
import { RoleModule } from '../role/role.module'
import { SystemModule } from '../system.module'

import { OnlineController } from './online.controller'
import { OnlineService } from './online.service'

const providers = [OnlineService]

@Module({
  imports: [
    forwardRef(() => SystemModule),
    forwardRef(() => SocketModule),
    AuthModule,
    UserModule,
    RoleModule,
  ],
  controllers: [OnlineController],
  providers,
  exports: [...providers],
})
export class OnlineModule {}
