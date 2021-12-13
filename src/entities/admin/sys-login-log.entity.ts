import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../base.entity';

@Entity({ name: 'sys_login_log' })
export default class SysLoginLog extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ nullable: true, name: 'user_id' })
  @ApiProperty()
  userId: number;

  @Column({ nullable: true })
  @ApiProperty()
  ip: string;

  @Column({ type: 'datetime', nullable: true })
  @ApiProperty()
  time: Date;

  @Column({ length: 500, nullable: true })
  @ApiProperty()
  ua: string;
}
