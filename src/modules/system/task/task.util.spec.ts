import { Packr } from 'msgpackr'

import { TaskType } from './constant'
import {
  buildOnceJobId,
  buildRepeatJobAdd,
  buildStoredJobOpts,
  repeatableJobId,
  shouldRetireRepeatableTask,
  SYS_TASK_JOB_NAME,
} from './task.util'

const packer = new Packr({
  useRecords: false,
  encodeUndefinedAsNil: true,
})

describe('task queue add args', () => {
  const cronTask = {
    id: 4,
    type: TaskType.Cron,
    service: 'HttpRequestJob.handle',
    data: '{"url":"https://example.com","method":"GET"}',
    cron: '*/2 * * * * *',
    every: 0,
    limit: 0,
    startTime: new Date('2026-01-01T00:00:00.000Z'),
    endTime: null,
  }

  it('keeps the payload as data and a stable job name', () => {
    const add = buildRepeatJobAdd(cronTask)

    expect(add.name).toBe(SYS_TASK_JOB_NAME)
    expect(typeof add.name).toBe('string')
    expect(add.name).not.toContain('{')
    expect(add.data).toEqual({
      id: 4,
      service: 'HttpRequestJob.handle',
      args: cronTask.data,
    })
  })

  it('uses a non-numeric job id without colons', () => {
    const add = buildRepeatJobAdd(cronTask)

    expect(add.opts.jobId).toBe('task-4')
    expect(add.opts.repeat.jobId).toBe('task-4')
    expect(/^\d+$/.test(add.opts.jobId)).toBe(false)
    expect(add.opts.jobId.includes(':')).toBe(false)
    expect(repeatableJobId(12)).toBe('task-12')
    expect(buildOnceJobId(12, 1000)).toBe('once-12-1000')
  })

  it('does not use removeOnComplete/removeOnFail true', () => {
    const add = buildRepeatJobAdd(cronTask)

    expect(add.opts.removeOnComplete).toBe(100)
    expect(add.opts.removeOnFail).toBe(100)
    expect(add.opts.removeOnComplete).not.toBe(true)
    expect(add.opts.removeOnFail).not.toBe(true)
  })

  it('stores only json-safe repeat options and survives msgpack', () => {
    const add = buildRepeatJobAdd(cronTask)
    const stored = JSON.parse(buildStoredJobOpts(add.opts.repeat))

    expect(stored).toEqual({
      name: SYS_TASK_JOB_NAME,
      jobId: 'task-4',
      repeat: {
        jobId: 'task-4',
        cron: '*/2 * * * * *',
        startDate: Date.parse('2026-01-01T00:00:00.000Z'),
      },
    })
    expect(stored.repeat.limit).toBeUndefined()
    expect(stored.repeat.every).toBeUndefined()
    expect(() => packer.pack(JSON.stringify(add.opts))).not.toThrow()
    expect(() => packer.pack(add.data)).not.toThrow()
  })

  it('packs unicode payloads the same way Bull packs job opts', () => {
    const add = buildRepeatJobAdd({
      id: 9,
      type: TaskType.Interval,
      service: '邮件任务.发送',
      data: '你好，调度',
      every: 1000,
      limit: -1,
    })

    expect(add.opts.repeat.every).toBe(1000)
    expect(add.opts.repeat.cron).toBeUndefined()
    expect(add.opts.repeat.limit).toBeUndefined()
    expect(() => packer.pack(JSON.stringify({ ...add.opts, data: add.data }))).not.toThrow()
  })

  it('rejects an interval that Bull cannot schedule', () => {
    expect(() => buildRepeatJobAdd({
      id: 1,
      type: TaskType.Interval,
      service: 'HttpRequestJob.handle',
      every: 50,
    })).toThrow(/every/)
  })
})

describe('shouldRetireRepeatableTask', () => {
  const now = Date.parse('2026-06-01T00:00:00.000Z')

  it('does not stop a healthy repeat just because the previous tick is already due', () => {
    expect(shouldRetireRepeatableTask(
      { limit: 0, endTime: null },
      { count: 8, now },
    )).toBe(false)
    expect(shouldRetireRepeatableTask(
      { limit: -1, endTime: null },
      { count: 1, now },
    )).toBe(false)
  })

  it('stops when the configured limit has been consumed', () => {
    expect(shouldRetireRepeatableTask(
      { limit: 3, endTime: null },
      { count: 3, now },
    )).toBe(true)
    expect(shouldRetireRepeatableTask(
      { limit: 3, endTime: null },
      { count: 2, now },
    )).toBe(false)
  })

  it('stops once endTime has passed', () => {
    expect(shouldRetireRepeatableTask(
      { limit: 0, endTime: new Date(now - 1) },
      { count: 1, now },
    )).toBe(true)
    expect(shouldRetireRepeatableTask(
      { limit: 0, endTime: new Date(now + 60_000) },
      { count: 4, now },
    )).toBe(false)
  })
})
