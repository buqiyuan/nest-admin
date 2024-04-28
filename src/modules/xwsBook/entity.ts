import {CommonEntity, CompleteEntity} from '~/common/entity/common.entity';
import {Column, Entity} from 'typeorm';
import {ApiProperty} from '@nestjs/swagger';

@Entity('xws_book')
export class _Entity extends CommonEntity {
  @Column()
  @ApiProperty({ description: 'name' })
  name:string ;

  @Column({nullable: true})
  @ApiProperty({ description: 'value' })
  value:number;
}
