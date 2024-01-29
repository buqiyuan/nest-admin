import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { paginate } from '~/helper/paginate'
import { Pagination } from '~/helper/paginate/pagination'
import { TodoEntity } from '~/modules/todo/todo.entity'

import { TodoDto, TodoQueryDto, TodoUpdateDto } from './todo.dto'

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(TodoEntity)
    private todoRepository: Repository<TodoEntity>,
  ) {}

  async list({
    page,
    pageSize,
  }: TodoQueryDto): Promise<Pagination<TodoEntity>> {
    return paginate(this.todoRepository, { page, pageSize })
  }

  async detail(id: number): Promise<TodoEntity> {
    const item = await this.todoRepository.findOneBy({ id })
    if (!item)
      throw new NotFoundException('未找到该记录')

    return item
  }

  async create(dto: TodoDto) {
    await this.todoRepository.save(dto)
  }

  async update(id: number, dto: TodoUpdateDto) {
    await this.todoRepository.update(id, dto)
  }

  async delete(id: number) {
    const item = await this.detail(id)

    await this.todoRepository.remove(item)
  }
}
