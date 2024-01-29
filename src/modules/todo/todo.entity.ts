import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity, JoinColumn, ManyToOne, Relation } from 'typeorm'

import { CommonEntity } from '~/common/entity/common.entity'
import { UserEntity } from '~/modules/user/user.entity'

@Entity('todo')
export class TodoEntity extends CommonEntity {
  @Column()
  @ApiProperty({ description: 'todo' })
  value: string

  @ApiProperty({ description: 'todo' })
  @Column({ default: false })
  status: boolean

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: Relation<UserEntity>
}
