import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('sys_captcha_log', { schema: 'mysql' })
export class sys_captcha_log extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number

  @Column('int', { name: 'user_id', nullable: true })
  userId: number | null

  @Column('varchar', { name: 'account', nullable: true, length: 255 })
  account: string | null

  @Column('varchar', { name: 'code', nullable: true, length: 255 })
  code: string | null

  @Column('varchar', { name: 'provider', nullable: true, length: 255 })
  provider: string | null

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
}
