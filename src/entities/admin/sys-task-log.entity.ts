import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../base.entity';

@Entity({ name: 'sys_task_log' })
export default class SysTaskLog extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ name: 'task_id' })
  @ApiProperty()
  taskId: number;

  @Column({ type: 'tinyint', default: 0 })
  @ApiProperty()
  status: number;

  @Column({ type: 'text', nullable: true })
  @ApiProperty()
  detail: string;

  @Column({ type: 'int', nullable: true, name: 'consume_time', default: 0 })
  @ApiProperty()
  consumeTime: number;
}
