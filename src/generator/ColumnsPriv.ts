import { BaseEntity, Column, Entity } from 'typeorm';

@Entity('columns_priv', { schema: 'mysql' })
export class columns_priv extends BaseEntity {
  @Column('char', { primary: true, name: 'Host', length: 255 })
  host: string;

  @Column('char', { primary: true, name: 'Db', length: 64 })
  db: string;

  @Column('char', { primary: true, name: 'User', length: 32 })
  user: string;

  @Column('char', { primary: true, name: 'Table_name', length: 64 })
  tableName: string;

  @Column('char', { primary: true, name: 'Column_name', length: 64 })
  columnName: string;

  @Column('timestamp', {
    name: 'Timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  timestamp: Date;

  @Column('set', {
    name: 'Column_priv',
    enum: ['Select', 'Insert', 'Update', 'References'],
  })
  columnPriv: ('Select' | 'Insert' | 'Update' | 'References')[];
}
