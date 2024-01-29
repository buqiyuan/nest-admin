import { NotFoundException } from '@nestjs/common'
import { ObjectLiteral, Repository } from 'typeorm'

import { PagerDto } from '~/common/dto/pager.dto'

import { paginate } from '../paginate'
import { Pagination } from '../paginate/pagination'

export class BaseService<E extends ObjectLiteral, R extends Repository<E> = Repository<E>> {
  constructor(private repository: R) {
  }

  async list({
    page,
    pageSize,
  }: PagerDto): Promise<Pagination<E>> {
    return paginate(this.repository, { page, pageSize })
  }

  async findOne(id: number): Promise<E> {
    const item = await this.repository.createQueryBuilder().where({ id }).getOne()
    if (!item)
      throw new NotFoundException('未找到该记录')

    return item
  }

  async create(dto: any): Promise<E> {
    return await this.repository.save(dto)
  }

  async update(id: number, dto: any): Promise<void> {
    await this.repository.update(id, dto)
  }

  async delete(id: number): Promise<void> {
    const item = await this.findOne(id)
    await this.repository.remove(item)
  }
}
