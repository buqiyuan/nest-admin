import { BaseEntity, Column, Entity } from 'typeorm'

@Entity('time_zone_leap_second', { schema: 'mysql' })
export class time_zone_leap_second extends BaseEntity {
  @Column('bigint', { primary: true, name: 'Transition_time' })
  transitionTime: string

  @Column('int', { name: 'Correction' })
  correction: number
}
