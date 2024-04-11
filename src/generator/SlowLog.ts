import { BaseEntity, Column, Entity } from 'typeorm';

@Entity('slow_log', { schema: 'mysql' })
export class slow_log extends BaseEntity {
  @Column('timestamp', {
    name: 'start_time',
    default: () => '\'CURRENT_TIMESTAMP(6)\'',
  })
  startTime: Date;

  @Column('mediumtext', { name: 'user_host' })
  userHost: string;

  @Column('time', { name: 'query_time' })
  queryTime: string;

  @Column('time', { name: 'lock_time' })
  lockTime: string;

  @Column('int', { name: 'rows_sent' })
  rowsSent: number;

  @Column('int', { name: 'rows_examined' })
  rowsExamined: number;

  @Column('varchar', { name: 'db', length: 512 })
  db: string;

  @Column('int', { name: 'last_insert_id' })
  lastInsertId: number;

  @Column('int', { name: 'insert_id' })
  insertId: number;

  @Column('int', { name: 'server_id', unsigned: true })
  serverId: number;

  @Column('mediumblob', { name: 'sql_text' })
  sqlText: Buffer;

  @Column('bigint', { name: 'thread_id', unsigned: true })
  threadId: string;
}
