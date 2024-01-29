import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity } from 'typeorm'

import { CommonEntity } from '~/common/entity/common.entity'

@Entity({ name: 'tool_storage' })
export class Storage extends CommonEntity {
  @Column({ type: 'varchar', length: 200, comment: '文件名' })
  @ApiProperty({ description: '文件名' })
  name: string

  @Column({
    type: 'varchar',
    length: 200,
    nullable: true,
    comment: '真实文件名',
  })
  @ApiProperty({ description: '真实文件名' })
  fileName: string

  @Column({ name: 'ext_name', type: 'varchar', nullable: true })
  @ApiProperty({ description: '扩展名' })
  extName: string

  @Column({ type: 'varchar' })
  @ApiProperty({ description: '文件类型' })
  path: string

  @Column({ type: 'varchar', nullable: true })
  @ApiProperty({ description: '文件类型' })
  type: string

  @Column({ type: 'varchar', nullable: true })
  @ApiProperty({ description: '文件大小' })
  size: string

  @Column({ nullable: true, name: 'user_id' })
  @ApiProperty({ description: '用户ID' })
  userId: number
}
