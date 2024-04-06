import { BaseEntity, Column, Entity, Index } from 'typeorm'

@Index('Grantor', ['grantor'], {})
@Entity('procs_priv', { schema: 'mysql' })
export class procs_priv extends BaseEntity {
  @Column('char', { primary: true, name: 'Host', length: 255 })
  host: string

  @Column('char', { primary: true, name: 'Db', length: 64 })
  db: string

  @Column('char', { primary: true, name: 'User', length: 32 })
  user: string

  @Column('char', { primary: true, name: 'Routine_name', length: 64 })
  routineName: string

  @Column('enum', {
    primary: true,
    name: 'Routine_type',
    enum: ['FUNCTION', 'PROCEDURE'],
  })
  routineType: 'FUNCTION' | 'PROCEDURE'

  @Column('varchar', { name: 'Grantor', length: 288 })
  grantor: string

  @Column('set', {
    name: 'Proc_priv',
    enum: ['Execute', 'Alter Routine', 'Grant'],
  })
  procPriv: ('Execute' | 'Alter Routine' | 'Grant')[]

  @Column('timestamp', {
    name: 'Timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  timestamp: Date
}
