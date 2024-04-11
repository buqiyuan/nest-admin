import { BaseEntity, Column, Entity, Index } from 'typeorm';

@Index('name', ['name'], { unique: true })
@Entity('help_topic', { schema: 'mysql' })
export class help_topic extends BaseEntity {
  @Column('int', { primary: true, name: 'help_topic_id', unsigned: true })
  helpTopicId: number;

  @Column('char', { name: 'name', unique: true, length: 64 })
  name: string;

  @Column('smallint', { name: 'help_category_id', unsigned: true })
  helpCategoryId: number;

  @Column('text', { name: 'description' })
  description: string;

  @Column('text', { name: 'example' })
  example: string;

  @Column('text', { name: 'url' })
  url: string;
}
