import {Injectable, NotFoundException} from '@nestjs/common';
import {EntityManager, In, Repository} from 'typeorm';
import {InjectEntityManager, InjectRepository} from '@nestjs/typeorm';
import {DemoEntity} from '~/modules/demo/demo.entity';
import {DemoDto, DemoQueryDto, DemoUpdateDto} from '~/modules/demo/demo.dto';
import {TodoQueryDto, TodoUpdateDto} from '~/modules/todo/todo.dto';
import {Pagination} from '~/helper/paginate/pagination';
import {TodoEntity} from '~/modules/todo/todo.entity';
import {paginate} from '~/helper/paginate';

@Injectable()
export class DemoService {
    constructor(
        @InjectRepository(DemoEntity)
        private readonly demoRepository: Repository<DemoEntity>
    ) {
    }


    async create(createDemoDto: DemoDto): Promise<void> {
        await this.demoRepository.save(createDemoDto);
    }

    async list({
                   page,
                   pageSize,
               }: DemoQueryDto): Promise<Pagination<DemoEntity>> {
        return paginate(this.demoRepository, { page, pageSize });
    }

    async detail(id: number): Promise<DemoEntity> {
        const item = await this.demoRepository.findOneBy({ id });
        if (!item)
            throw new NotFoundException('未找到该记录');

        return item;
    }

    async update(id: number, dto: DemoUpdateDto) {
        await this.demoRepository.update(id, dto);
    }

    async delete(id: number) {
        const item = await this.detail(id);
        await this.demoRepository.remove(item);
    }
}
