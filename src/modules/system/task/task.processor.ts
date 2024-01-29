import { OnQueueCompleted, Process, Processor } from '@nestjs/bull'
import { Job } from 'bull'

import { TaskLogService } from '../log/services/task-log.service'

import { SYS_TASK_QUEUE_NAME } from './constant'

import { TaskService } from './task.service'

export interface ExecuteData {
  id: number
  args?: string | null
  service: string
}

@Processor(SYS_TASK_QUEUE_NAME)
export class TaskConsumer {
  constructor(
    private taskService: TaskService,
    private taskLogService: TaskLogService,
  ) {}

  @Process()
  async handle(job: Job<ExecuteData>): Promise<void> {
    const startTime = Date.now()
    const { data } = job
    try {
      await this.taskService.callService(data.service, data.args)
      const timing = Date.now() - startTime
      // 任务执行成功
      await this.taskLogService.create(data.id, 1, timing)
    }
    catch (e) {
      const timing = Date.now() - startTime
      // 执行失败
      await this.taskLogService.create(data.id, 0, timing, `${e}`)
    }
  }

  @OnQueueCompleted()
  onCompleted(job: Job<ExecuteData>) {
    this.taskService.updateTaskCompleteStatus(job.data.id)
  }
}
