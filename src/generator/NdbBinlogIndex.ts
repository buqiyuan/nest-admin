import { BaseEntity, Column, Entity } from 'typeorm';

@Entity('ndb_binlog_index', { schema: 'mysql' })
export class ndb_binlog_index extends BaseEntity {
  @Column('bigint', { name: 'Position', unsigned: true })
  position: string;

  @Column('varchar', { name: 'File', length: 255 })
  file: string;

  @Column('bigint', { primary: true, name: 'epoch', unsigned: true })
  epoch: string;

  @Column('int', { name: 'inserts', unsigned: true })
  inserts: number;

  @Column('int', { name: 'updates', unsigned: true })
  updates: number;

  @Column('int', { name: 'deletes', unsigned: true })
  deletes: number;

  @Column('int', { name: 'schemaops', unsigned: true })
  schemaops: number;

  @Column('int', { primary: true, name: 'orig_server_id', unsigned: true })
  origServerId: number;

  @Column('bigint', { primary: true, name: 'orig_epoch', unsigned: true })
  origEpoch: string;

  @Column('int', { name: 'gci', unsigned: true })
  gci: number;

  @Column('bigint', { name: 'next_position', unsigned: true })
  nextPosition: string;

  @Column('varchar', { name: 'next_file', length: 255 })
  nextFile: string;
}
