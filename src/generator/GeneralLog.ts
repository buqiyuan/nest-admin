import { BaseEntity, Column, Entity } from 'typeorm';

@Entity('general_log', { schema: 'mysql' })
export class general_log extends BaseEntity {
  @Column('timestamp', {
    name: 'event_time',
    default: () => '\'CURRENT_TIMESTAMP(6)\'',
  })
  eventTime: Date;

  @Column('mediumtext', { name: 'user_host' })
  userHost: string;

  @Column('bigint', { name: 'thread_id', unsigned: true })
  threadId: string;

  @Column('int', { name: 'server_id', unsigned: true })
  serverId: number;

  @Column('varchar', { name: 'command_type', length: 64 })
  commandType: string;

  @Column('mediumblob', { name: 'argument' })
  argument: Buffer;
}
