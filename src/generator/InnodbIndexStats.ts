import { BaseEntity, Column, Entity } from 'typeorm';

@Entity('innodb_index_stats', { schema: 'mysql' })
export class innodb_index_stats extends BaseEntity {
  @Column('varchar', { primary: true, name: 'database_name', length: 64 })
  databaseName: string;

  @Column('varchar', { primary: true, name: 'table_name', length: 199 })
  tableName: string;

  @Column('varchar', { primary: true, name: 'index_name', length: 64 })
  indexName: string;

  @Column('timestamp', {
    name: 'last_update',
    default: () => 'CURRENT_TIMESTAMP',
  })
  lastUpdate: Date;

  @Column('varchar', { primary: true, name: 'stat_name', length: 64 })
  statName: string;

  @Column('bigint', { name: 'stat_value', unsigned: true })
  statValue: string;

  @Column('bigint', { name: 'sample_size', nullable: true, unsigned: true })
  sampleSize: string | null;

  @Column('varchar', { name: 'stat_description', length: 1024 })
  statDescription: string;
}
