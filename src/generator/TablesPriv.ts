import { BaseEntity, Column, Entity, Index } from 'typeorm'

@Index('Grantor', ['grantor'], {})
@Entity('tables_priv', { schema: 'mysql' })
export class tables_priv extends BaseEntity {
  @Column('char', { primary: true, name: 'Host', length: 255 })
  host: string

  @Column('char', { primary: true, name: 'Db', length: 64 })
  db: string

  @Column('char', { primary: true, name: 'User', length: 32 })
  user: string

  @Column('char', { primary: true, name: 'Table_name', length: 64 })
  tableName: string

  @Column('varchar', { name: 'Grantor', length: 288 })
  grantor: string

  @Column('timestamp', {
    name: 'Timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  timestamp: Date

  @Column('set', {
    name: 'Table_priv',
    enum: [
      'Select',
      'Insert',
      'Update',
      'Delete',
      'Create',
      'Drop',
      'Grant',
      'References',
      'Index',
      'Alter',
      'Create View',
      'Show view',
      'Trigger',
    ],
  })
  tablePriv: (
    | 'Select'
    | 'Insert'
    | 'Update'
    | 'Delete'
    | 'Create'
    | 'Drop'
    | 'Grant'
    | 'References'
    | 'Index'
    | 'Alter'
    | 'Create View'
    | 'Show view'
    | 'Trigger'
  )[]

  @Column('set', {
    name: 'Column_priv',
    enum: ['Select', 'Insert', 'Update', 'References'],
  })
  columnPriv: ('Select' | 'Insert' | 'Update' | 'References')[]
}
