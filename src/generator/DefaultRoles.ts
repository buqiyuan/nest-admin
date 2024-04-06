import { BaseEntity, Column, Entity } from 'typeorm'

@Entity('default_roles', { schema: 'mysql' })
export class default_roles extends BaseEntity {
  @Column('char', { primary: true, name: 'HOST', length: 255 })
  host: string

  @Column('char', { primary: true, name: 'USER', length: 32 })
  user: string

  @Column('char', {
    primary: true,
    name: 'DEFAULT_ROLE_HOST',
    length: 255,
    default: () => '\'%\'',
  })
  defaultRoleHost: string

  @Column('char', { primary: true, name: 'DEFAULT_ROLE_USER', length: 32 })
  defaultRoleUser: string
}
