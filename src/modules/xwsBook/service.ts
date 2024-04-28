import {Injectable, NotFoundException} from '@nestjs/common';
import {EntityManager, In, Repository} from 'typeorm';
import {InjectEntityManager, InjectRepository} from '@nestjs/typeorm';
import {Pagination} from '~/helper/paginate/pagination';
import {paginate} from '~/helper/paginate';

// 定义具体引用
import {_Entity as Entity} from './entity';
import {Dto, QueryDto, UpdateDto} from './dto';


@Injectable()
export class Service {
    constructor(
        @InjectRepository(Entity)
        private readonly repository: Repository<Entity>
    ) {
    }


    async create(Dto: Dto): Promise<void> {
        await this.repository.save(Dto);
    }

    async list({
                   page,
                   pageSize,
               }: QueryDto): Promise<Pagination<Entity>> {
        return paginate(this.repository, {page, pageSize});
    }

    async detail(id: number): Promise<Entity> {
        const item = await this.repository.findOneBy({id});
        if (!item)
            throw new NotFoundException('未找到该记录');

        return item;
    }

    async update(id: number, dto: UpdateDto) {
        await this.repository.update(id, dto);
    }

    async delete(id: number) {
        const item = await this.detail(id);
        await this.repository.remove(item);
    }
}
