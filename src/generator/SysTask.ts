import {
  BaseEntity,
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { sys_task_log } from './SysTaskLog'

@Index('IDX_ef8e5ab5ef2fe0ddb1428439ef', ['name'], { unique: true })
@Entity('sys_task', { schema: 'mysql' })
export class sys_task extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number

  @Column('varchar', { name: 'name', unique: true, length: 50 })
  name: string

  @Column('varchar', { name: 'service', length: 255 })
  service: string

  @Column('tinyint', { name: 'type', default: () => '\'0\'' })
  type: number

  @Column('tinyint', { name: 'status', default: () => '\'1\'' })
  status: number

  @Column('datetime', { name: 'start_time', nullable: true })
  startTime: Date | null

  @Column('datetime', { name: 'end_time', nullable: true })
  endTime: Date | null

  @Column('int', { name: 'limit', nullable: true, default: () => '\'0\'' })
  limit: number | null

  @Column('varchar', { name: 'cron', nullable: true, length: 255 })
  cron: string | null

  @Column('int', { name: 'every', nullable: true })
  every: number | null

  @Column('text', { name: 'data', nullable: true })
  data: string | null

  @Column('text', { name: 'job_opts', nullable: true })
  jobOpts: string | null

  @Column('varchar', { name: 'remark', nullable: true, length: 255 })
  remark: string | null

  @Column('datetime', {
    name: 'created_at',
    default: () => '\'CURRENT_TIMESTAMP(6)\'',
  })
  createdAt: Date

  @Column('datetime', {
    name: 'updated_at',
    default: () => '\'CURRENT_TIMESTAMP(6)\'',
  })
  updatedAt: Date

  @OneToMany(() => sys_task_log, sysTaskLog => sysTaskLog.task)
  sysTaskLogs: sys_task_log[]
}
