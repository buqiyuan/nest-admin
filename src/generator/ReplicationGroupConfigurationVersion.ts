import { BaseEntity, Column, Entity } from 'typeorm';

@Entity('replication_group_configuration_version', { schema: 'mysql' })
export class replication_group_configuration_version extends BaseEntity {
  @Column('char', {
    primary: true,
    name: 'name',
    comment: 'The configuration name.',
    length: 255,
  })
  name: string;

  @Column('bigint', {
    name: 'version',
    comment: 'The version of the configuration name.',
    unsigned: true,
  })
  version: string;
}
