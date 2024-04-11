import { BaseEntity, Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { user_access_tokens } from './UserAccessTokens';

@Entity('user_refresh_tokens', { schema: 'mysql' })
export class user_refresh_tokens extends BaseEntity {
  @Column('varchar', { primary: true, name: 'id', length: 36 })
  id: string;

  @Column('varchar', { name: 'value', length: 500 })
  value: string;

  @Column('datetime', { name: 'expired_at', comment: '令牌过期时间' })
  expiredAt: Date;

  @Column('datetime', {
    name: 'created_at',
    comment: '令牌创建时间',
    default: () => '\'CURRENT_TIMESTAMP(6)\'',
  })
  createdAt: Date;

  @OneToOne(
    () => user_access_tokens,
    userAccessTokens => userAccessTokens.userRefreshTokens,
    { onDelete: 'CASCADE', onUpdate: 'NO ACTION' },
  )
  @JoinColumn([{ name: 'accessTokenId', referencedColumnName: 'id' }])
  accessToken: user_access_tokens;
}
