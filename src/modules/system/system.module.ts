import { Module } from '@nestjs/common'

import { RouterModule } from '@nestjs/core'

import { UserModule } from '../user/user.module'

import { DeptModule } from './dept/dept.module'
import { DictItemModule } from './dict-item/dict-item.module'
import { DictTypeModule } from './dict-type/dict-type.module'
import { LogModule } from './log/log.module'
import { MenuModule } from './menu/menu.module'
import { OnlineModule } from './online/online.module'
import { ParamConfigModule } from './param-config/param-config.module'
import { RoleModule } from './role/role.module'
import { ServeModule } from './serve/serve.module'
import { TaskModule } from './task/task.module'

const modules = [
  UserModule,
  RoleModule,
  MenuModule,
  DeptModule,
  DictTypeModule,
  DictItemModule,
  ParamConfigModule,
  LogModule,
  TaskModule,
  OnlineModule,
  ServeModule,
]

@Module({
  imports: [
    ...modules,
    RouterModule.register([
      {
        path: 'system',
        module: SystemModule,
        children: [...modules],
      },
    ]),
  ],
  exports: [...modules],
})
export class SystemModule {}
