import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../base.entity';

@Entity({ name: 'sys_task' })
export default class SysTask extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  @ApiProperty()
  name: string;

  @Column()
  @ApiProperty()
  service: string;

  @Column({ type: 'tinyint', default: 0 })
  @ApiProperty()
  type: number;

  @Column({ type: 'tinyint', default: 1 })
  @ApiProperty()
  status: number;

  @Column({ name: 'start_time', type: 'datetime', nullable: true })
  @ApiProperty()
  startTime: Date;

  @Column({ name: 'end_time', type: 'datetime', nullable: true })
  @ApiProperty()
  endTime: Date;

  @Column({ type: 'int', nullable: true, default: 0 })
  @ApiProperty()
  limit: number;

  @Column({ nullable: true })
  @ApiProperty()
  cron: string;

  @Column({ type: 'int', nullable: true })
  @ApiProperty()
  every: number;

  @Column({ type: 'text', nullable: true })
  @ApiProperty()
  data: string;

  @Column({ name: 'job_opts', type: 'text', nullable: true })
  @ApiProperty()
  jobOpts: string;

  @Column({ nullable: true })
  @ApiProperty()
  remark: string;
}
