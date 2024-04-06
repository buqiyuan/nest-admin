import { BaseEntity, Column, Entity } from 'typeorm'

@Entity('help_relation', { schema: 'mysql' })
export class help_relation extends BaseEntity {
  @Column('int', { primary: true, name: 'help_topic_id', unsigned: true })
  helpTopicId: number

  @Column('int', { primary: true, name: 'help_keyword_id', unsigned: true })
  helpKeywordId: number
}
