import { BaseEntity, Column, Entity, Index } from 'typeorm';

@Index('event', ['event'], {})
@Entity('replication_group_member_actions', { schema: 'mysql' })
export class replication_group_member_actions extends BaseEntity {
  @Column('char', {
    primary: true,
    name: 'name',
    comment: 'The action name.',
    length: 255,
  })
  name: string;

  @Column('char', {
    primary: true,
    name: 'event',
    comment: 'The event that will trigger the action.',
    length: 64,
  })
  event: string;

  @Column('tinyint', {
    name: 'enabled',
    comment: 'Whether the action is enabled.',
    width: 1,
  })
  enabled: boolean;

  @Column('char', { name: 'type', comment: 'The action type.', length: 64 })
  type: string;

  @Column('tinyint', {
    name: 'priority',
    comment:
      'The order on which the action will be run, value between 1 and 100, lower values first.',
    unsigned: true,
  })
  priority: number;

  @Column('char', {
    name: 'error_handling',
    comment: 'On errors during the action will be handled: IGNORE, CRITICAL.',
    length: 64,
  })
  errorHandling: string;
}
