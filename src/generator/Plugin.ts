import { BaseEntity, Column, Entity } from 'typeorm'

@Entity('plugin', { schema: 'mysql' })
export class plugin extends BaseEntity {
  @Column('varchar', { primary: true, name: 'name', length: 64 })
  name: string

  @Column('varchar', { name: 'dl', length: 128 })
  dl: string
}
