import { OnQueueCompleted, Process, Processor } from '@nestjs/bull'
import { Logger } from '@nestjs/common'
import { Job } from 'bull'

import { TaskLogService } from '../log/services/task-log.service'

import { SYS_TASK_QUEUE_NAME } from './constant'
import { TaskService } from './task.service'

import { SYS_TASK_JOB_NAME } from './task.util'

export interface ExecuteData {
  id: number
  args?: string | null
  service: string
}

@Processor(SYS_TASK_QUEUE_NAME)
export class TaskConsumer {
  private logger = new Logger(TaskConsumer.name)

  constructor(
    private taskService: TaskService,
    private taskLogService: TaskLogService,
  ) {}

  @Process(SYS_TASK_JOB_NAME)
  async handle(job: Job<ExecuteData>): Promise<void> {
    await this.execute(job)
  }

  /**
   * 升级前入队的任务没有 job name，Bull 会落到 `__default__`。
   * 启动时会清掉这些旧任务；这里仍接住，避免漏掉清理前已经弹出的一拍。
   */
  @Process()
  async handleLegacy(job: Job<ExecuteData>): Promise<void> {
    await this.execute(job)
  }

  private async execute(job: Job<ExecuteData>): Promise<void> {
    const startTime = Date.now()
    const { data } = job
    if (!data?.service || data.id == null) {
      this.logger.warn(`skip job ${job.id}: payload is not a task descriptor`)
      return
    }

    try {
      await this.taskService.callService(data.service, data.args)
      const timing = Date.now() - startTime
      await this.taskLogService.create(data.id, 1, timing)
    }
    catch (e) {
      const timing = Date.now() - startTime
      await this.taskLogService.create(data.id, 0, timing, `${e}`)
    }
  }

  @OnQueueCompleted()
  onCompleted(job: Job<ExecuteData>) {
    void this.taskService.updateTaskCompleteStatus(job).catch((error) => {
      this.logger.error(`updateTaskCompleteStatus failed: ${error}`)
    })
  }
}
