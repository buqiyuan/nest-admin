import { BaseEntity, Column, Entity, Index } from 'typeorm'

@Index('User', ['user'], {})
@Entity('db', { schema: 'mysql' })
export class db extends BaseEntity {
  @Column('char', { primary: true, name: 'Host', length: 255 })
  host: string

  @Column('char', { primary: true, name: 'Db', length: 64 })
  db: string

  @Column('char', { primary: true, name: 'User', length: 32 })
  user: string

  @Column('enum', {
    name: 'Select_priv',
    enum: ['N', 'Y'],
    default: () => '\'N\'',
  })
  selectPriv: 'N' | 'Y'

  @Column('enum', {
    name: 'Insert_priv',
    enum: ['N', 'Y'],
    default: () => '\'N\'',
  })
  insertPriv: 'N' | 'Y'

  @Column('enum', {
    name: 'Update_priv',
    enum: ['N', 'Y'],
    default: () => '\'N\'',
  })
  updatePriv: 'N' | 'Y'

  @Column('enum', {
    name: 'Delete_priv',
    enum: ['N', 'Y'],
    default: () => '\'N\'',
  })
  deletePriv: 'N' | 'Y'

  @Column('enum', {
    name: 'Create_priv',
    enum: ['N', 'Y'],
    default: () => '\'N\'',
  })
  createPriv: 'N' | 'Y'

  @Column('enum', { name: 'Drop_priv', enum: ['N', 'Y'], default: () => '\'N\'' })
  dropPriv: 'N' | 'Y'

  @Column('enum', {
    name: 'Grant_priv',
    enum: ['N', 'Y'],
    default: () => '\'N\'',
  })
  grantPriv: 'N' | 'Y'

  @Column('enum', {
    name: 'References_priv',
    enum: ['N', 'Y'],
    default: () => '\'N\'',
  })
  referencesPriv: 'N' | 'Y'

  @Column('enum', {
    name: 'Index_priv',
    enum: ['N', 'Y'],
    default: () => '\'N\'',
  })
  indexPriv: 'N' | 'Y'

  @Column('enum', {
    name: 'Alter_priv',
    enum: ['N', 'Y'],
    default: () => '\'N\'',
  })
  alterPriv: 'N' | 'Y'

  @Column('enum', {
    name: 'Create_tmp_table_priv',
    enum: ['N', 'Y'],
    default: () => '\'N\'',
  })
  createTmpTablePriv: 'N' | 'Y'

  @Column('enum', {
    name: 'Lock_tables_priv',
    enum: ['N', 'Y'],
    default: () => '\'N\'',
  })
  lockTablesPriv: 'N' | 'Y'

  @Column('enum', {
    name: 'Create_view_priv',
    enum: ['N', 'Y'],
    default: () => '\'N\'',
  })
  createViewPriv: 'N' | 'Y'

  @Column('enum', {
    name: 'Show_view_priv',
    enum: ['N', 'Y'],
    default: () => '\'N\'',
  })
  showViewPriv: 'N' | 'Y'

  @Column('enum', {
    name: 'Create_routine_priv',
    enum: ['N', 'Y'],
    default: () => '\'N\'',
  })
  createRoutinePriv: 'N' | 'Y'

  @Column('enum', {
    name: 'Alter_routine_priv',
    enum: ['N', 'Y'],
    default: () => '\'N\'',
  })
  alterRoutinePriv: 'N' | 'Y'

  @Column('enum', {
    name: 'Execute_priv',
    enum: ['N', 'Y'],
    default: () => '\'N\'',
  })
  executePriv: 'N' | 'Y'

  @Column('enum', {
    name: 'Event_priv',
    enum: ['N', 'Y'],
    default: () => '\'N\'',
  })
  eventPriv: 'N' | 'Y'

  @Column('enum', {
    name: 'Trigger_priv',
    enum: ['N', 'Y'],
    default: () => '\'N\'',
  })
  triggerPriv: 'N' | 'Y'
}
