import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../base.entity';

@Entity({ name: 'sys_menu' })
export default class SysMenu extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ name: 'parent_id', nullable: true })
  @ApiProperty()
  parentId: number;

  @Column()
  @ApiProperty()
  name: string;

  @Column({ nullable: true })
  @ApiProperty()
  router: string;

  @Column({ nullable: true })
  @ApiProperty()
  perms: string;

  @Column({ type: 'tinyint', default: 0 })
  @ApiProperty()
  type: number;

  @Column({ nullable: true })
  @ApiProperty()
  icon: string;

  @Column({ name: 'order_num', type: 'int', default: 0, nullable: true })
  @ApiProperty()
  orderNum: number;

  @Column({ name: 'view_path', nullable: true })
  @ApiProperty()
  viewPath: string;

  @Column({ type: 'boolean', nullable: true, default: true })
  @ApiProperty()
  keepalive: boolean;

  @Column({ name: 'is_show', type: 'boolean', nullable: true, default: true })
  @ApiProperty()
  isShow: boolean;
}
