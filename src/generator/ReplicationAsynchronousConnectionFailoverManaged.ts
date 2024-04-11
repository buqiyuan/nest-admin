import { BaseEntity, Column, Entity } from 'typeorm';

@Entity('replication_asynchronous_connection_failover_managed', {
  schema: 'mysql',
})
export class replication_asynchronous_connection_failover_managed extends BaseEntity {
  @Column('char', {
    primary: true,
    name: 'Channel_name',
    comment: 'The replication channel name that connects source and replica.',
    length: 64,
  })
  channelName: string;

  @Column('char', {
    primary: true,
    name: 'Managed_name',
    comment: 'The name of the source which needs to be managed.',
    length: 64,
  })
  managedName: string;

  @Column('char', {
    name: 'Managed_type',
    comment: 'Determines the managed type.',
    length: 64,
  })
  managedType: string;

  @Column('json', {
    name: 'Configuration',
    nullable: true,
    comment:
      'The data to help manage group. For Managed_type = GroupReplication, Configuration value should contain {Primary_weight: 80, Secondary_weight: 60}, so that it assigns weight=80 to PRIMARY of the group, and weight=60 for rest of the members in mysql.replication_asynchronous_connection_failover table.',
  })
  configuration: object | null;
}
