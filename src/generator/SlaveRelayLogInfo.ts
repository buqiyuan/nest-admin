import { BaseEntity, Column, Entity } from 'typeorm'

@Entity('slave_relay_log_info', { schema: 'mysql' })
export class slave_relay_log_info extends BaseEntity {
  @Column('int', {
    name: 'Number_of_lines',
    comment:
      'Number of lines in the file or rows in the table. Used to version table definitions.',
    unsigned: true,
  })
  numberOfLines: number

  @Column('text', {
    name: 'Relay_log_name',
    nullable: true,
    comment: 'The name of the current relay log file.',
  })
  relayLogName: string | null

  @Column('bigint', {
    name: 'Relay_log_pos',
    nullable: true,
    comment: 'The relay log position of the last executed event.',
    unsigned: true,
  })
  relayLogPos: string | null

  @Column('text', {
    name: 'Master_log_name',
    nullable: true,
    comment:
      'The name of the master binary log file from which the events in the relay log file were read.',
  })
  masterLogName: string | null

  @Column('bigint', {
    name: 'Master_log_pos',
    nullable: true,
    comment: 'The master log position of the last executed event.',
    unsigned: true,
  })
  masterLogPos: string | null

  @Column('int', {
    name: 'Sql_delay',
    nullable: true,
    comment: 'The number of seconds that the slave must lag behind the master.',
  })
  sqlDelay: number | null

  @Column('int', { name: 'Number_of_workers', nullable: true, unsigned: true })
  numberOfWorkers: number | null

  @Column('int', {
    name: 'Id',
    nullable: true,
    comment: 'Internal Id that uniquely identifies this record.',
    unsigned: true,
  })
  id: number | null

  @Column('varchar', {
    primary: true,
    name: 'Channel_name',
    comment:
      'The channel on which the replica is connected to a source. Used in Multisource Replication',
    length: 64,
  })
  channelName: string

  @Column('varchar', {
    name: 'Privilege_checks_username',
    nullable: true,
    comment: 'Username part of PRIVILEGE_CHECKS_USER.',
    length: 32,
  })
  privilegeChecksUsername: string | null

  @Column('varchar', {
    name: 'Privilege_checks_hostname',
    nullable: true,
    comment: 'Hostname part of PRIVILEGE_CHECKS_USER.',
    length: 255,
  })
  privilegeChecksHostname: string | null

  @Column('tinyint', {
    name: 'Require_row_format',
    comment:
      'Indicates whether the channel shall only accept row based events.',
    width: 1,
  })
  requireRowFormat: boolean

  @Column('enum', {
    name: 'Require_table_primary_key_check',
    comment:
      'Indicates what is the channel policy regarding tables without primary keys on create and alter table queries',
    enum: ['STREAM', 'ON', 'OFF', 'GENERATE'],
    default: () => '\'STREAM\'',
  })
  requireTablePrimaryKeyCheck: 'STREAM' | 'ON' | 'OFF' | 'GENERATE'

  @Column('enum', {
    name: 'Assign_gtids_to_anonymous_transactions_type',
    comment:
      'Indicates whether the channel will generate a new GTID for anonymous transactions. OFF means that anonymous transactions will remain anonymous. LOCAL means that anonymous transactions will be assigned a newly generated GTID based on server_uuid. UUID indicates that anonymous transactions will be assigned a newly generated GTID based on Assign_gtids_to_anonymous_transactions_value',
    enum: ['OFF', 'LOCAL', 'UUID'],
    default: () => '\'OFF\'',
  })
  assignGtidsToAnonymousTransactionsType: 'OFF' | 'LOCAL' | 'UUID'

  @Column('text', {
    name: 'Assign_gtids_to_anonymous_transactions_value',
    nullable: true,
    comment:
      'Indicates the UUID used while generating GTIDs for anonymous transactions',
  })
  assignGtidsToAnonymousTransactionsValue: string | null
}
