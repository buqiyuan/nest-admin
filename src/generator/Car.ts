import { BaseEntity, Column, Entity } from 'typeorm'

@Entity('car', { schema: 'mysql' })
export class car extends BaseEntity {
  @Column('int', { primary: true, name: 'id' })
  id: number

  @Column('varchar', { name: 'car_name', comment: '汽车名', length: 255 })
  carName: string

  @Column('varchar', {
    name: 'remark',
    nullable: true,
    comment: '备注',
    length: 255,
  })
  remark: string | null

  @Column('datetime', { name: 'created_at' })
  createdAt: Date

  @Column('datetime', { name: 'updated_at' })
  updatedAt: Date
}
