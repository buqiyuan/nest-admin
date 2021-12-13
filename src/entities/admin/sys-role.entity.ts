import { ApiProperty } from '@nestjs/swagger';
import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';
import { BaseEntity } from '../base.entity';

@Entity({ name: 'sys_role' })
export default class SysRole extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ name: 'user_id' })
  @ApiProperty()
  userId: string;

  @Column({ unique: true })
  @ApiProperty()
  name: string;

  @Column({ length: 50, unique: true })
  @ApiProperty()
  label: string;

  @Column({ nullable: true })
  @ApiProperty()
  remark: string;
}
