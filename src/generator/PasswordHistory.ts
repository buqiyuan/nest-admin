import { BaseEntity, Column, Entity } from 'typeorm'

@Entity('password_history', { schema: 'mysql' })
export class password_history extends BaseEntity {
  @Column('char', { primary: true, name: 'Host', length: 255 })
  host: string

  @Column('char', { primary: true, name: 'User', length: 32 })
  user: string

  @Column('timestamp', {
    primary: true,
    name: 'Password_timestamp',
    default: () => '\'CURRENT_TIMESTAMP(6)\'',
  })
  passwordTimestamp: Date

  @Column('text', { name: 'Password', nullable: true })
  password: string | null
}
