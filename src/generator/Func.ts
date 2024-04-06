import { BaseEntity, Column, Entity } from 'typeorm'

@Entity('func', { schema: 'mysql' })
export class func extends BaseEntity {
  @Column('char', { primary: true, name: 'name', length: 64 })
  name: string

  @Column('tinyint', { name: 'ret', default: () => '\'0\'' })
  ret: number

  @Column('char', { name: 'dl', length: 128 })
  dl: string

  @Column('enum', { name: 'type', enum: ['function', 'aggregate'] })
  type: 'function' | 'aggregate'
}
