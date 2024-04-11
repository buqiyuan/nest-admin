import { BaseEntity, Column, Entity } from 'typeorm';

@Entity('innodb_table_stats', { schema: 'mysql' })
export class innodb_table_stats extends BaseEntity {
  @Column('varchar', { primary: true, name: 'database_name', length: 64 })
  databaseName: string;

  @Column('varchar', { primary: true, name: 'table_name', length: 199 })
  tableName: string;

  @Column('timestamp', {
    name: 'last_update',
    default: () => 'CURRENT_TIMESTAMP',
  })
  lastUpdate: Date;

  @Column('bigint', { name: 'n_rows', unsigned: true })
  nRows: string;

  @Column('bigint', { name: 'clustered_index_size', unsigned: true })
  clusteredIndexSize: string;

  @Column('bigint', { name: 'sum_of_other_index_sizes', unsigned: true })
  sumOfOtherIndexSizes: string;
}
