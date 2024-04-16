import {ApiHideProperty, ApiProperty} from '@nestjs/swagger';
import {
    Column,
    Entity,
    OneToMany,
    Relation,
    Tree,
    TreeChildren,
    TreeParent,
} from 'typeorm';

import {CommonEntity} from '~/common/entity/common.entity';

@Entity({name: 'ai_xws_book'})
export class XWSEntity extends CommonEntity {
    @Column()
    @ApiProperty({description: '序号'})
    number: number;


    @Column()
    @ApiProperty({description: '内容'})
    content: string;
}
