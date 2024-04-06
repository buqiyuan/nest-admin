import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { sys_task } from './SysTask'

@Entity('sys_task_log', { schema: 'mysql' })
export class sys_task_log extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number

  @Column('tinyint', { name: 'status', default: () => '\'0\'' })
  status: number

  @Column('text', { name: 'detail', nullable: true })
  detail: string | null

  @Column('int', { name: 'consume_time', nullable: true, default: () => '\'0\'' })
  consumeTime: number | null

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

  @ManyToOne(() => sys_task, sysTask => sysTask.sysTaskLogs, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'task_id', referencedColumnName: 'id' }])
  task: sys_task
}
