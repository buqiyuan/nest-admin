import { BaseEntity, Column, Entity, Index } from 'typeorm';

@Index('Channel_name', ['channelName', 'managedName'], {})
@Entity('replication_asynchronous_connection_failover', { schema: 'mysql' })
export class replication_asynchronous_connection_failover extends BaseEntity {
  @Column('char', {
    primary: true,
    name: 'Channel_name',
    comment: 'The replication channel name that connects source and replica.',
    length: 64,
  })
  channelName: string;

  @Column('char', {
    primary: true,
    name: 'Host',
    comment:
      'The source hostname that the replica will attempt to switch over the replication connection to in case of a failure.',
    length: 255,
  })
  host: string;

  @Column('int', {
    primary: true,
    name: 'Port',
    comment:
      'The source port that the replica will attempt to switch over the replication connection to in case of a failure.',
    unsigned: true,
  })
  port: number;

  @Column('char', {
    primary: true,
    name: 'Network_namespace',
    comment:
      'The source network namespace that the replica will attempt to switch over the replication connection to in case of a failure. If its value is empty, connections use the default (global) namespace.',
    length: 64,
  })
  networkNamespace: string;

  @Column('tinyint', {
    name: 'Weight',
    comment:
      'The order in which the replica shall try to switch the connection over to when there are failures. Weight can be set to a number between 1 and 100, where 100 is the highest weight and 1 the lowest.',
    unsigned: true,
  })
  weight: number;

  @Column('char', {
    primary: true,
    name: 'Managed_name',
    comment: 'The name of the group which this server belongs to.',
    length: 64,
  })
  managedName: string;
}
