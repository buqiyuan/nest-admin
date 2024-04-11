import { BaseEntity, Column, Entity, Index } from 'typeorm';

@Index('name', ['name'], { unique: true })
@Entity('help_keyword', { schema: 'mysql' })
export class help_keyword extends BaseEntity {
  @Column('int', { primary: true, name: 'help_keyword_id', unsigned: true })
  helpKeywordId: number;

  @Column('char', { name: 'name', unique: true, length: 64 })
  name: string;
}
