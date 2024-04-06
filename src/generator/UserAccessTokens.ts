import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm'

import { sys_user } from './SysUser'
import { user_refresh_tokens } from './UserRefreshTokens'

@Entity('user_access_tokens', { schema: 'mysql' })
export class user_access_tokens extends BaseEntity {
  @Column('varchar', { primary: true, name: 'id', length: 36 })
  id: string

  @Column('varchar', { name: 'value', length: 500 })
  value: string

  @Column('datetime', { name: 'expired_at', comment: '令牌过期时间' })
  expiredAt: Date

  @Column('datetime', {
    name: 'created_at',
    comment: '令牌创建时间',
    default: () => '\'CURRENT_TIMESTAMP(6)\'',
  })
  createdAt: Date

  @ManyToOne(() => sys_user, sysUser => sysUser.userAccessTokens, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: sys_user

  @OneToOne(
    () => user_refresh_tokens,
    userRefreshTokens => userRefreshTokens.accessToken,
  )
  userRefreshTokens: user_refresh_tokens
}
