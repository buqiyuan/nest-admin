import { BaseEntity, Column, Entity } from 'typeorm'

@Entity('gtid_executed', { schema: 'mysql' })
export class gtid_executed extends BaseEntity {
  @Column('char', {
    primary: true,
    name: 'source_uuid',
    comment:
      'uuid of the source where the transaction was originally executed.',
    length: 36,
  })
  sourceUuid: string

  @Column('bigint', {
    primary: true,
    name: 'interval_start',
    comment: 'First number of interval.',
  })
  intervalStart: string

  @Column('bigint', {
    name: 'interval_end',
    comment: 'Last number of interval.',
  })
  intervalEnd: string
}
