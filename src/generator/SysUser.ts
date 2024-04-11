import {
  BaseEntity,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { sys_dept } from './SysDept';
import { sys_login_log } from './SysLoginLog';
import { sys_role } from './SysRole';
import { todo } from './Todo';
import { user_access_tokens } from './UserAccessTokens';

@Index('IDX_9e7164b2f1ea1348bc0eb0a7da', ['username'], { unique: true })
@Entity('sys_user', { schema: 'mysql' })
export class sys_user extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'username', unique: true, length: 255 })
  username: string;

  @Column('varchar', { name: 'password', length: 255 })
  password: string;

  @Column('varchar', { name: 'avatar', nullable: true, length: 255 })
  avatar: string | null;

  @Column('varchar', { name: 'email', nullable: true, length: 255 })
  email: string | null;

  @Column('varchar', { name: 'phone', nullable: true, length: 255 })
  phone: string | null;

  @Column('varchar', { name: 'remark', nullable: true, length: 255 })
  remark: string | null;

  @Column('varchar', { name: 'psalt', length: 32 })
  psalt: string;

  @Column('tinyint', { name: 'status', nullable: true, default: () => '\'1\'' })
  status: number | null;

  @Column('varchar', { name: 'qq', nullable: true, length: 255 })
  qq: string | null;

  @Column('datetime', {
    name: 'created_at',
    default: () => '\'CURRENT_TIMESTAMP(6)\'',
  })
  createdAt: Date;

  @Column('datetime', {
    name: 'updated_at',
    default: () => '\'CURRENT_TIMESTAMP(6)\'',
  })
  updatedAt: Date;

  @Column('varchar', { name: 'nickname', nullable: true, length: 255 })
  nickname: string | null;

  @OneToMany(() => sys_login_log, sysLoginLog => sysLoginLog.user)
  sysLoginLogs: sys_login_log[];

  @ManyToOne(() => sys_dept, sysDept => sysDept.sysUsers, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'dept_id', referencedColumnName: 'id' }])
  dept: sys_dept;

  @ManyToMany(() => sys_role, sysRole => sysRole.sysUsers)
  sysRoles: sys_role[];

  @OneToMany(() => todo, todo => todo.user)
  todos: todo[];

  @OneToMany(
    () => user_access_tokens,
    userAccessTokens => userAccessTokens.user,
  )
  userAccessTokens: user_access_tokens[];
}
