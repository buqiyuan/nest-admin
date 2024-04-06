import { BaseEntity, Column, Entity } from 'typeorm'

@Entity('role_edges', { schema: 'mysql' })
export class role_edges extends BaseEntity {
  @Column('char', { primary: true, name: 'FROM_HOST', length: 255 })
  fromHost: string

  @Column('char', { primary: true, name: 'FROM_USER', length: 32 })
  fromUser: string

  @Column('char', { primary: true, name: 'TO_HOST', length: 255 })
  toHost: string

  @Column('char', { primary: true, name: 'TO_USER', length: 32 })
  toUser: string

  @Column('enum', {
    name: 'WITH_ADMIN_OPTION',
    enum: ['N', 'Y'],
    default: () => '\'N\'',
  })
  withAdminOption: 'N' | 'Y'
}
