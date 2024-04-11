import { BaseEntity, Column, Entity } from 'typeorm';

@Entity('time_zone_transition_type', { schema: 'mysql' })
export class time_zone_transition_type extends BaseEntity {
  @Column('int', { primary: true, name: 'Time_zone_id', unsigned: true })
  timeZoneId: number;

  @Column('int', { primary: true, name: 'Transition_type_id', unsigned: true })
  transitionTypeId: number;

  @Column('int', { name: 'Offset', default: () => '\'0\'' })
  offset: number;

  @Column('tinyint', { name: 'Is_DST', unsigned: true, default: () => '\'0\'' })
  isDst: number;

  @Column('char', { name: 'Abbreviation', length: 8 })
  abbreviation: string;
}
