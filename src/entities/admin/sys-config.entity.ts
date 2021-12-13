import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../base.entity';

@Entity({ name: 'sys_config' })
export default class SysConfig extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  @ApiProperty()
  key: string;

  @Column({ type: 'varchar', length: 50 })
  @ApiProperty()
  name: string;

  @Column({ type: 'varchar', nullable: true })
  @ApiProperty()
  value: string;

  @Column({ type: 'varchar', nullable: true })
  @ApiProperty()
  remark: string;
}
