import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('time_zone', { schema: 'mysql' })
export class time_zone extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'Time_zone_id', unsigned: true })
  timeZoneId: number;

  @Column('enum', {
    name: 'Use_leap_seconds',
    enum: ['Y', 'N'],
    default: () => '\'N\'',
  })
  useLeapSeconds: 'Y' | 'N';
}
