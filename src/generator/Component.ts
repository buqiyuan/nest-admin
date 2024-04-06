import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('component', { schema: 'mysql' })
export class component extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'component_id', unsigned: true })
  componentId: number

  @Column('int', { name: 'component_group_id', unsigned: true })
  componentGroupId: number

  @Column('text', { name: 'component_urn' })
  componentUrn: string
}
