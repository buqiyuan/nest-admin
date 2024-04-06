import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('tool_storage', { schema: 'mysql' })
export class tool_storage extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number

  @Column('datetime', {
    name: 'created_at',
    default: () => '\'CURRENT_TIMESTAMP(6)\'',
  })
  createdAt: Date

  @Column('datetime', {
    name: 'updated_at',
    default: () => '\'CURRENT_TIMESTAMP(6)\'',
  })
  updatedAt: Date

  @Column('varchar', { name: 'name', comment: '文件名', length: 200 })
  name: string

  @Column('varchar', {
    name: 'fileName',
    nullable: true,
    comment: '真实文件名',
    length: 200,
  })
  fileName: string | null

  @Column('varchar', { name: 'ext_name', nullable: true, length: 255 })
  extName: string | null

  @Column('varchar', { name: 'path', length: 255 })
  path: string

  @Column('varchar', { name: 'type', nullable: true, length: 255 })
  type: string | null

  @Column('varchar', { name: 'size', nullable: true, length: 255 })
  size: string | null

  @Column('int', { name: 'user_id', nullable: true })
  userId: number | null
}
