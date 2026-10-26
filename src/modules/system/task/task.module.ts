import { BullModule } from '@nestjs/bull'
import { Module } from '@nestjs/common'

import { ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ConfigKeyPaths, IRedisConfig } from '~/config'

import { LogModule } from '../log/log.module'

import { SYS_TASK_QUEUE_NAME, SYS_TASK_QUEUE_PREFIX } from './constant'

import { TaskController } from './task.controller'
import { TaskEntity } from './task.entity'
import { TaskConsumer } from './task.processor'
import { TaskService } from './task.service'

const providers = [TaskService, TaskConsumer]

@Module({
  imports: [
    TypeOrmModule.forFeature([TaskEntity]),
    BullModule.registerQueueAsync({
      name: SYS_TASK_QUEUE_NAME,
      useFactory: (configService: ConfigService<ConfigKeyPaths>) => ({
        redis: configService.get<IRedisConfig>('redis'),
        prefix: SYS_TASK_QUEUE_PREFIX,
        settings: {
          // 默认 30s 锁会把稍慢的任务判成 stalled。重复任务的下一次在进入 active 时才入队，
          // stalled 次数用尽后这条链会断。
          lockDuration: 120_000,
          stalledInterval: 120_000,
          maxStalledCount: 3,
        },
      }),
      inject: [ConfigService],
    }),
    LogModule,
  ],
  controllers: [TaskController],
  providers: [...providers],
  exports: [TypeOrmModule, ...providers],
})
export class TaskModule {}
