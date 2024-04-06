import { BaseEntity, Column, Entity, Index } from 'typeorm'

@Index('Grantor', ['grantor'], {})
@Entity('proxies_priv', { schema: 'mysql' })
export class proxies_priv extends BaseEntity {
  @Column('char', { primary: true, name: 'Host', length: 255 })
  host: string

  @Column('char', { primary: true, name: 'User', length: 32 })
  user: string

  @Column('char', { primary: true, name: 'Proxied_host', length: 255 })
  proxiedHost: string

  @Column('char', { primary: true, name: 'Proxied_user', length: 32 })
  proxiedUser: string

  @Column('tinyint', { name: 'With_grant', width: 1, default: () => '\'0\'' })
  withGrant: boolean

  @Column('varchar', { name: 'Grantor', length: 288 })
  grantor: string

  @Column('timestamp', {
    name: 'Timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  timestamp: Date
}
