import { BaseEntity, Column, Entity } from 'typeorm';

@Entity('time_zone_name', { schema: 'mysql' })
export class time_zone_name extends BaseEntity {
  @Column('char', { primary: true, name: 'Name', length: 64 })
  name: string;

  @Column('int', { name: 'Time_zone_id', unsigned: true })
  timeZoneId: number;
}
