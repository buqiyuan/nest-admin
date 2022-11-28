import { ApiProperty } from '@nestjs/swagger';
import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';
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

  /* 登录地点 */
  @Column({
    name: 'login_location',
    comment: '登录地点',
    length: 255,
    default: '',
  })
  @ApiProperty()
  loginLocation: string;

  @Column({ type: 'datetime', nullable: true })
  @ApiProperty()
  time: Date;

  @Column({ length: 500, nullable: true })
  @ApiProperty()
  ua: string;
}
