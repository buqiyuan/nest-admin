import { InjectQueue } from '@nestjs/bull'
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common'
import { ModuleRef, Reflector } from '@nestjs/core'
import { UnknownElementException } from '@nestjs/core/errors/exceptions/unknown-element.exception'
import { InjectRepository } from '@nestjs/typeorm'
import { Job, JobOptions, Queue } from 'bull'
import Redis from 'ioredis'
import { isEmpty, isNil } from 'lodash'
import { Like, Repository } from 'typeorm'
import { InjectRedis } from '~/common/decorators/inject-redis.decorator'

import { BusinessException } from '~/common/exceptions/biz.exception'
import { ErrorEnum } from '~/constants/error-code.constant'

import { paginate } from '~/helper/paginate'
import { Pagination } from '~/helper/paginate/pagination'

import { TaskEntity } from '~/modules/system/task/task.entity'
import { MISSION_DECORATOR_KEY } from '~/modules/tasks/mission.decorator'

import {
  SYS_TASK_QUEUE_NAME,
  SYS_TASK_QUEUE_PREFIX,
  TaskStatus,
} from './constant'
import { TaskDto, TaskQueryDto, TaskUpdateDto } from './task.dto'
import {
  buildOnceJobId,
  buildRepeatJobAdd,
  buildStoredJobOpts,
  repeatableIdsForTask,
  shouldRetireRepeatableTask,
  SYS_TASK_JOB_NAME,
  TASK_JOB_KEEP,
} from './task.util'

@Injectable()
export class TaskService implements OnModuleInit {
  private logger = new Logger(TaskService.name)

  constructor(
    @InjectRepository(TaskEntity)
    private taskRepository: Repository<TaskEntity>,
    @InjectQueue(SYS_TASK_QUEUE_NAME) private taskQueue: Queue,
    private moduleRef: ModuleRef,
    private reflector: Reflector,
    @InjectRedis() private redis: Redis,
  ) {}

  /**
   * module init
   */
  async onModuleInit() {
    await this.initTask()
  }

  /**
   * 初始化任务，系统启动前调用
   */
  async initTask(): Promise<void> {
    const initKey = `${SYS_TASK_QUEUE_PREFIX}:init`
    // 防止重复初始化
    const result = await this.redis
      .multi()
      .setnx(initKey, new Date().getTime())
      .expire(initKey, 60 * 30)
      .exec()
    if (result[0][1] === 0) {
      // 存在锁则直接跳过防止重复初始化
      this.logger.log('Init task is lock', TaskService.name)
      return
    }
    try {
      await this.clearQueueSchedules()

      // 查找所有需要运行的任务
      const tasks = await this.taskRepository.findBy({ status: TaskStatus.Activited })
      for (const task of tasks) {
        try {
          await this.start(task)
        }
        catch (error) {
          this.logger.error(`Failed to restore task ${task.id}: ${error}`)
        }
      }
    }
    finally {
      // 启动后释放锁
      await this.redis.del(initKey)
    }
  }

  /**
   * 先删 repeatable 配置，再删已经生成的 job。
   * 不 await 的话，后完成的 remove 会把刚刚重新入队的下一拍删掉，调度就此停住。
   */
  private async clearQueueSchedules(): Promise<void> {
    const repeatables = await this.taskQueue.getRepeatableJobs()
    for (const job of repeatables) {
      try {
        await this.taskQueue.removeRepeatableByKey(job.key)
      }
      catch (error) {
        this.logger.warn(`removeRepeatableByKey ${job.key} failed: ${error}`)
      }
    }

    await this.removeJobs(() => true)
  }

  async list({
    page,
    pageSize,
    name,
    service,
    type,
    status,
  }: TaskQueryDto): Promise<Pagination<TaskEntity>> {
    const queryBuilder = this.taskRepository
      .createQueryBuilder('task')
      .where({
        ...(name ? { name: Like(`%${name}%`) } : null),
        ...(service ? { service: Like(`%${service}%`) } : null),
        ...(type ? { type } : null),
        ...(!isNil(status) ? { status } : null),
      })
      .orderBy('task.id', 'ASC')

    return paginate(queryBuilder, { page, pageSize })
  }

  /**
   * task info
   */
  async info(id: number): Promise<TaskEntity> {
    const task = this.taskRepository
      .createQueryBuilder('task')
      .where({ id })
      .getOne()

    if (!task)
      throw new NotFoundException('Task Not Found')

    return task
  }

  /**
   * delete task
   */
  async delete(task: TaskEntity): Promise<void> {
    if (!task)
      throw new BadRequestException('Task is Empty')

    await this.stop(task)
    await this.taskRepository.delete(task.id)
  }

  /**
   * 手动执行一次
   */
  async once(task: TaskEntity): Promise<void | never> {
    if (!task)
      throw new BadRequestException('Task is Empty')

    await this.taskQueue.add(
      SYS_TASK_JOB_NAME,
      { id: task.id, service: task.service, args: task.data ?? null },
      {
        jobId: buildOnceJobId(task.id),
        removeOnComplete: TASK_JOB_KEEP,
        removeOnFail: TASK_JOB_KEEP,
      },
    )
  }

  async create(dto: TaskDto): Promise<void> {
    const result = await this.taskRepository.save(dto)
    const task = await this.info(result.id)
    if (result.status === 0)
      await this.stop(task)
    else if (result.status === TaskStatus.Activited)
      await this.start(task)
  }

  async update(id: number, dto: TaskUpdateDto): Promise<void> {
    await this.taskRepository.update(id, dto)
    const task = await this.info(id)
    if (task.status === 0)
      await this.stop(task)
    else if (task.status === TaskStatus.Activited)
      await this.start(task)
  }

  /**
   * 启动任务
   */
  async start(task: TaskEntity): Promise<void> {
    if (!task)
      throw new BadRequestException('Task is Empty')

    // 先停掉之前存在的任务
    await this.stop(task)

    let add: ReturnType<typeof buildRepeatJobAdd>
    try {
      add = buildRepeatJobAdd(task)
    }
    catch (error) {
      throw new BadRequestException(error instanceof Error ? error.message : 'Task Start failed')
    }

    // 第一个参数必须是 job name。把 JSON.stringify(payload) 放在这里时，
    // Bull 会把它当成 job name，processor 匹配不到，Redis 侧也不会按任务数据入队。
    const job = await this.taskQueue.add(add.name, add.data, add.opts as JobOptions)
    if (job?.opts?.repeat) {
      await this.taskRepository.update(task.id, {
        jobOpts: buildStoredJobOpts(add.opts.repeat),
        status: TaskStatus.Activited,
      })
      return
    }

    await job?.remove().catch(() => undefined)
    await this.taskRepository.update(task.id, {
      status: TaskStatus.Disabled,
    })
    throw new BadRequestException('Task Start failed')
  }

  /**
   * 停止任务
   */
  async stop(task: TaskEntity): Promise<void> {
    if (!task)
      throw new BadRequestException('Task is Empty')

    await this.removeTaskJobs(task)
    await this.taskRepository.update(task.id, { status: TaskStatus.Disabled })
  }

  private async removeTaskJobs(task: TaskEntity): Promise<void> {
    const ids = new Set(repeatableIdsForTask(task.id))
    const repeatables = await this.taskQueue.getRepeatableJobs()
    for (const job of repeatables) {
      if (job.id == null || !ids.has(String(job.id)))
        continue

      try {
        await this.taskQueue.removeRepeatableByKey(job.key)
      }
      catch (error) {
        this.logger.warn(`removeRepeatableByKey ${job.key} failed: ${error}`)
      }
    }

    await this.removeStoredRepeatable(task)
    await this.removeJobs(job => job.data?.id === task.id)
  }

  /**
   * 用入队时保存的 repeat 再删一次。
   * getRepeatableJobs 按 `:` 拆 key，旧数据或带特殊字符的 cron 可能解析不出 id。
   */
  private async removeStoredRepeatable(task: TaskEntity): Promise<void> {
    if (!task.jobOpts)
      return

    const stored = this.safeParse(task.jobOpts)
    if (!stored || typeof stored !== 'object')
      return

    const record = stored as Record<string, any>
    const nested = record.repeat && typeof record.repeat === 'object'
      ? record.repeat as Record<string, any>
      : record
    const name = typeof record.name === 'string' ? record.name : undefined
    const cron = typeof nested.cron === 'string' ? nested.cron : undefined
    const every = nested.every == null ? undefined : Number(nested.every)
    if (!cron && (every == null || Number.isNaN(every)))
      return

    const rawJobId = nested.jobId ?? record.jobId
    const jobId = typeof rawJobId === 'string' || typeof rawJobId === 'number' ? rawJobId : undefined
    const endDate = typeof nested.endDate === 'string' || typeof nested.endDate === 'number'
      ? nested.endDate
      : undefined
    const startDate = typeof nested.startDate === 'string' || typeof nested.startDate === 'number'
      ? nested.startDate
      : undefined
    const tz = typeof nested.tz === 'string' ? nested.tz : undefined

    try {
      if (cron) {
        const repeat = { cron, jobId, endDate, startDate, tz }
        if (name)
          await this.taskQueue.removeRepeatable(name, repeat)
        else
          await this.taskQueue.removeRepeatable(repeat)
      }
      else if (every != null) {
        const repeat = { every, jobId, endDate, tz }
        if (name)
          await this.taskQueue.removeRepeatable(name, repeat)
        else
          await this.taskQueue.removeRepeatable(repeat)
      }
    }
    catch (error) {
      this.logger.warn(`removeRepeatable failed: ${error}`)
    }
  }

  private async removeJobs(match: (job: Job) => boolean): Promise<void> {
    const jobs = await this.taskQueue.getJobs([
      'active',
      'delayed',
      'failed',
      'paused',
      'waiting',
      'completed',
    ])
    for (const job of jobs) {
      if (!job || !match(job))
        continue

      try {
        await job.remove()
      }
      catch (error) {
        this.logger.warn(`remove job ${job.id} failed: ${error}`)
      }
    }
  }

  /**
   * 次数用尽或超过结束时间后，停掉调度并改状态。
   * 不能用 `next < now` 判断：间隔任务只要这一轮比 every 慢，下一拍的分数就已经落在过去。
   */
  async updateTaskCompleteStatus(job: Job<{ id?: number }>): Promise<void> {
    const tid = job?.data?.id
    if (!tid)
      return

    const task = await this.taskRepository.findOneBy({ id: tid })
    if (!task || task.status !== TaskStatus.Activited)
      return

    const count = job.opts?.repeat?.count
    if (!shouldRetireRepeatableTask(task, { count }))
      return

    this.logger.log(`task ${tid} finished its schedule (count=${count ?? 'n/a'}), stopping`)
    await this.stop(task)
  }

  /**
   * 检测service是否有注解定义
   */
  async checkHasMissionMeta(
    nameOrInstance: string | unknown,
    exec: string,
  ): Promise<void | never> {
    try {
      let service: any
      if (typeof nameOrInstance === 'string')
        service = await this.moduleRef.get(nameOrInstance, { strict: false })
      else
        service = nameOrInstance

      // 所执行的任务不存在
      if (!service || !(exec in service))
        throw new NotFoundException('任务不存在')

      // 检测是否有Mission注解
      const hasMission = this.reflector.get<boolean>(
        MISSION_DECORATOR_KEY,
        service.constructor,
      )
      // 如果没有，则抛出错误
      if (!hasMission)
        throw new BusinessException(ErrorEnum.INSECURE_MISSION)
    }
    catch (e) {
      if (e instanceof UnknownElementException) {
        // 任务不存在
        throw new NotFoundException('任务不存在')
      }
      else {
        // 其余错误则不处理，继续抛出
        throw e
      }
    }
  }

  /**
   * 根据serviceName调用service，例如 LogService.clearReqLog
   */
  async callService(name: string, args: string): Promise<void> {
    if (name) {
      const [serviceName, methodName] = name.split('.')
      if (!methodName)
        throw new BadRequestException('serviceName define BadRequestException')

      const service = await this.moduleRef.get(serviceName, {
        strict: false,
      })

      // 安全注解检查
      await this.checkHasMissionMeta(service, methodName)
      if (isEmpty(args)) {
        await service[methodName]()
      }
      else {
        // 参数安全判断
        const parseArgs = this.safeParse(args)

        if (Array.isArray(parseArgs)) {
          // 数组形式则自动扩展成方法参数回掉
          await service[methodName](...parseArgs)
        }
        else {
          await service[methodName](parseArgs)
        }
      }
    }
  }

  safeParse(args: string): unknown | string {
    try {
      return JSON.parse(args)
    }
    catch (e) {
      return args
    }
  }
}
