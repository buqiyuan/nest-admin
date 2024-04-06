import {
  BaseEntity,
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Index('IDX_d112365748f740ee260b65ce91', ['name'], { unique: true })
@Entity('sys_dict', { schema: 'mysql' })
export class sys_dict extends BaseEntity {
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

  @Column('int', { name: 'create_by', comment: '创建者' })
  createBy: number

  @Column('int', { name: 'update_by', comment: '更新者' })
  updateBy: number

  @Column('varchar', { name: 'name', unique: true, length: 50 })
  name: string

  @Column('tinyint', { name: 'status', default: () => '\'1\'' })
  status: number

  @Column('varchar', { name: 'remark', nullable: true, length: 255 })
  remark: string | null
}
