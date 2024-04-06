import { BaseEntity, Column, Entity } from 'typeorm'

@Entity('user', { schema: 'mysql' })
export class user extends BaseEntity {
  @Column('char', { primary: true, name: 'Host', length: 255 })
  host: string

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
    name: 'Reload_priv',
    enum: ['N', 'Y'],
    default: () => '\'N\'',
  })
  reloadPriv: 'N' | 'Y'

  @Column('enum', {
    name: 'Shutdown_priv',
    enum: ['N', 'Y'],
    default: () => '\'N\'',
  })
  shutdownPriv: 'N' | 'Y'

  @Column('enum', {
    name: 'Process_priv',
    enum: ['N', 'Y'],
    default: () => '\'N\'',
  })
  processPriv: 'N' | 'Y'

  @Column('enum', { name: 'File_priv', enum: ['N', 'Y'], default: () => '\'N\'' })
  filePriv: 'N' | 'Y'

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
    name: 'Show_db_priv',
    enum: ['N', 'Y'],
    default: () => '\'N\'',
  })
  showDbPriv: 'N' | 'Y'

  @Column('enum', {
    name: 'Super_priv',
    enum: ['N', 'Y'],
    default: () => '\'N\'',
  })
  superPriv: 'N' | 'Y'

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
    name: 'Execute_priv',
    enum: ['N', 'Y'],
    default: () => '\'N\'',
  })
  executePriv: 'N' | 'Y'

  @Column('enum', {
    name: 'Repl_slave_priv',
    enum: ['N', 'Y'],
    default: () => '\'N\'',
  })
  replSlavePriv: 'N' | 'Y'

  @Column('enum', {
    name: 'Repl_client_priv',
    enum: ['N', 'Y'],
    default: () => '\'N\'',
  })
  replClientPriv: 'N' | 'Y'

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
    name: 'Create_user_priv',
    enum: ['N', 'Y'],
    default: () => '\'N\'',
  })
  createUserPriv: 'N' | 'Y'

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

  @Column('enum', {
    name: 'Create_tablespace_priv',
    enum: ['N', 'Y'],
    default: () => '\'N\'',
  })
  createTablespacePriv: 'N' | 'Y'

  @Column('enum', { name: 'ssl_type', enum: ['', 'ANY', 'X509', 'SPECIFIED'] })
  sslType: '' | 'ANY' | 'X509' | 'SPECIFIED'

  @Column('blob', { name: 'ssl_cipher' })
  sslCipher: Buffer

  @Column('blob', { name: 'x509_issuer' })
  x509Issuer: Buffer

  @Column('blob', { name: 'x509_subject' })
  x509Subject: Buffer

  @Column('int', {
    name: 'max_questions',
    unsigned: true,
    default: () => '\'0\'',
  })
  maxQuestions: number

  @Column('int', { name: 'max_updates', unsigned: true, default: () => '\'0\'' })
  maxUpdates: number

  @Column('int', {
    name: 'max_connections',
    unsigned: true,
    default: () => '\'0\'',
  })
  maxConnections: number

  @Column('int', {
    name: 'max_user_connections',
    unsigned: true,
    default: () => '\'0\'',
  })
  maxUserConnections: number

  @Column('char', {
    name: 'plugin',
    length: 64,
    default: () => '\'caching_sha2_password\'',
  })
  plugin: string

  @Column('text', { name: 'authentication_string', nullable: true })
  authenticationString: string | null

  @Column('enum', {
    name: 'password_expired',
    enum: ['N', 'Y'],
    default: () => '\'N\'',
  })
  passwordExpired: 'N' | 'Y'

  @Column('timestamp', { name: 'password_last_changed', nullable: true })
  passwordLastChanged: Date | null

  @Column('smallint', {
    name: 'password_lifetime',
    nullable: true,
    unsigned: true,
  })
  passwordLifetime: number | null

  @Column('enum', {
    name: 'account_locked',
    enum: ['N', 'Y'],
    default: () => '\'N\'',
  })
  accountLocked: 'N' | 'Y'

  @Column('enum', {
    name: 'Create_role_priv',
    enum: ['N', 'Y'],
    default: () => '\'N\'',
  })
  createRolePriv: 'N' | 'Y'

  @Column('enum', {
    name: 'Drop_role_priv',
    enum: ['N', 'Y'],
    default: () => '\'N\'',
  })
  dropRolePriv: 'N' | 'Y'

  @Column('smallint', {
    name: 'Password_reuse_history',
    nullable: true,
    unsigned: true,
  })
  passwordReuseHistory: number | null

  @Column('smallint', {
    name: 'Password_reuse_time',
    nullable: true,
    unsigned: true,
  })
  passwordReuseTime: number | null

  @Column('enum', {
    name: 'Password_require_current',
    nullable: true,
    enum: ['N', 'Y'],
  })
  passwordRequireCurrent: 'N' | 'Y' | null

  @Column('json', { name: 'User_attributes', nullable: true })
  userAttributes: object | null
}
