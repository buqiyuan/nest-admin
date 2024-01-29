import { BullModule } from '@nestjs/bull'
import { Module } from '@nestjs/common'

import { ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

import { IRedisConfig } from '~/config'

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
      useFactory: (configService: ConfigService) => ({
        redis: configService.get<IRedisConfig>('redis'),
        prefix: SYS_TASK_QUEUE_PREFIX,
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
