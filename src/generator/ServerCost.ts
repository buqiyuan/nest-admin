import { BaseEntity, Column, Entity } from 'typeorm';

@Entity('server_cost', { schema: 'mysql' })
export class server_cost extends BaseEntity {
  @Column('varchar', { primary: true, name: 'cost_name', length: 64 })
  costName: string;

  @Column('float', { name: 'cost_value', nullable: true, precision: 12 })
  costValue: number | null;

  @Column('timestamp', {
    name: 'last_update',
    default: () => 'CURRENT_TIMESTAMP',
  })
  lastUpdate: Date;

  @Column('varchar', { name: 'comment', nullable: true, length: 1024 })
  comment: string | null;

  @Column('float', { name: 'default_value', nullable: true, precision: 12 })
  defaultValue: number | null;
}
