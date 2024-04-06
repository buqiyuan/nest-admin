import { BaseEntity, Column, Entity, Index } from 'typeorm'

@Index('name', ['name'], { unique: true })
@Entity('help_category', { schema: 'mysql' })
export class help_category extends BaseEntity {
  @Column('smallint', {
    primary: true,
    name: 'help_category_id',
    unsigned: true,
  })
  helpCategoryId: number

  @Column('char', { name: 'name', unique: true, length: 64 })
  name: string

  @Column('smallint', {
    name: 'parent_category_id',
    nullable: true,
    unsigned: true,
  })
  parentCategoryId: number | null

  @Column('text', { name: 'url' })
  url: string
}
