import { TaskType } from './constant'

/** Bull 用第一个字符串参数当 job name。业务数据不能放在这个位置。 */
export const SYS_TASK_JOB_NAME = 'sys-task'

/**
 * 保留最近若干条完成/失败记录。
 * `removeOnComplete: true` 在 Bull 里是保留 0 条，完成时立刻删掉 job hash，
 * 和 repeatable 的下一次延迟任务抢同一轮清理。
 */
export const TASK_JOB_KEEP = 100

export interface TaskScheduleSource {
  id: number
  type: number
  every?: number | null
  cron?: string | null
  startTime?: Date | string | null
  endTime?: Date | string | null
  limit?: number | null
  service: string
  data?: string | null
}

export interface TaskRepeatOptions {
  jobId: string
  cron?: string
  every?: number
  startDate?: number
  endDate?: number
  limit?: number
}

export interface TaskJobPayload {
  id: number
  service: string
  args: string | null
}

export interface StoredJobOpts {
  name: string
  jobId: string
  repeat: TaskRepeatOptions
}

export interface RepeatJobAdd {
  name: string
  data: TaskJobPayload
  opts: {
    jobId: string
    repeat: TaskRepeatOptions
    removeOnComplete: number
    removeOnFail: number
  }
}

/**
 * Bull 的自增 job id 是纯数字。自定义 id 若也是纯数字，会和自增 id 撞 key；
 * id 里的 `:` 会被 repeat key 按段拆开，`getRepeatableJobs()` 读出来的 id 就错了。
 */
export function repeatableJobId(taskId: number): string {
  if (!Number.isInteger(taskId) || taskId <= 0)
    throw new TypeError(`invalid task id: ${taskId}`)

  return `task-${taskId}`
}

/** 新 id，以及升级前用数字 task.id 注册的 repeatable。 */
export function repeatableIdsForTask(taskId: number): string[] {
  return [repeatableJobId(taskId), String(taskId)]
}

export function toEpoch(value: Date | string | null | undefined): number | undefined {
  if (value == null || value === '')
    return undefined

  const date = value instanceof Date ? value : new Date(value)
  const ms = date.getTime()
  if (Number.isNaN(ms))
    throw new TypeError(`invalid date: ${String(value)}`)

  return ms
}

export function buildRepeatOptions(task: TaskScheduleSource): TaskRepeatOptions {
  const repeat: TaskRepeatOptions = { jobId: repeatableJobId(task.id) }

  if (task.type === TaskType.Interval) {
    const every = Number(task.every)
    if (!Number.isInteger(every) || every < 100)
      throw new TypeError('interval every must be an integer >= 100')

    repeat.every = every
  }
  else {
    const cron = (task.cron ?? '').trim()
    if (!cron)
      throw new TypeError('cron expression is empty')

    repeat.cron = cron
  }

  const startDate = toEpoch(task.startTime)
  const endDate = toEpoch(task.endTime)
  if (startDate != null && endDate != null && endDate < startDate)
    throw new TypeError('endTime is before startTime')

  if (startDate != null)
    repeat.startDate = startDate
  if (endDate != null)
    repeat.endDate = endDate

  // limit 为 0 或负数表示不限制。传 0 给 Bull 时，第一次计数就会超过上限，任务永远不会再调度。
  if (task.limit != null && task.limit > 0)
    repeat.limit = task.limit

  return repeat
}

export function buildJobPayload(task: Pick<TaskScheduleSource, 'id' | 'service' | 'data'>): TaskJobPayload {
  return {
    id: Number(task.id),
    service: task.service,
    args: task.data ?? null,
  }
}

export function buildRepeatJobAdd(task: TaskScheduleSource): RepeatJobAdd {
  const repeat = buildRepeatOptions(task)
  return {
    name: SYS_TASK_JOB_NAME,
    data: buildJobPayload(task),
    opts: {
      jobId: repeat.jobId,
      repeat,
      removeOnComplete: TASK_JOB_KEEP,
      removeOnFail: TASK_JOB_KEEP,
    },
  }
}

export function buildOnceJobId(taskId: number, now = Date.now()): string {
  return `once-${taskId}-${now}`
}

export function buildStoredJobOpts(repeat: TaskRepeatOptions): string {
  const stored: StoredJobOpts = {
    name: SYS_TASK_JOB_NAME,
    jobId: repeat.jobId,
    repeat,
  }
  return JSON.stringify(stored)
}

/**
 * 只在执行次数用尽或结束时间已到时停掉调度。
 * `next < now` 只说明这一拍已经到期，或者上一轮跑得比间隔更久，不能当成调度结束。
 */
export function shouldRetireRepeatableTask(
  task: { limit?: number | null, endTime?: Date | string | null },
  run: { count?: number | null, now?: number },
): boolean {
  const now = run.now ?? Date.now()
  if (task.limit != null && task.limit > 0 && (run.count ?? 0) >= task.limit)
    return true

  const end = toEpoch(task.endTime)
  if (end != null && now >= end)
    return true

  return false
}
