import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity, JoinColumn, ManyToOne, Relation } from 'typeorm'

import { CommonEntity } from '~/common/entity/common.entity'

import { UserEntity } from '../../../user/user.entity'

@Entity({ name: 'sys_login_log' })
export class LoginLogEntity extends CommonEntity {
  @Column({ nullable: true })
  @ApiProperty({ description: 'IP' })
  ip: string

  @Column({ nullable: true })
  @ApiProperty({ description: '地址' })
  address: string

  @Column({ nullable: true })
  @ApiProperty({ description: '登录方式' })
  provider: string

  @Column({ length: 500, nullable: true })
  @ApiProperty({ description: '浏览器ua' })
  ua: string

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: Relation<UserEntity>
}
