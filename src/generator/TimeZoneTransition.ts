import { BaseEntity, Column, Entity } from 'typeorm';

@Entity('time_zone_transition', { schema: 'mysql' })
export class time_zone_transition extends BaseEntity {
  @Column('int', { primary: true, name: 'Time_zone_id', unsigned: true })
  timeZoneId: number;

  @Column('bigint', { primary: true, name: 'Transition_time' })
  transitionTime: string;

  @Column('int', { name: 'Transition_type_id', unsigned: true })
  transitionTypeId: number;
}
