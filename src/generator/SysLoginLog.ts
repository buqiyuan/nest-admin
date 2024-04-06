import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { sys_user } from './SysUser'

@Entity('sys_login_log', { schema: 'mysql' })
export class sys_login_log extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number

  @Column('varchar', { name: 'ip', nullable: true, length: 255 })
  ip: string | null

  @Column('varchar', { name: 'ua', nullable: true, length: 500 })
  ua: string | null

  @Column('varchar', { name: 'address', nullable: true, length: 255 })
  address: string | null

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

  @ManyToOne(() => sys_user, sysUser => sysUser.sysLoginLogs, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: sys_user
}
