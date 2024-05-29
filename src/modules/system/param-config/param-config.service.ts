import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Repository } from 'typeorm'

import { paginate } from '~/helper/paginate'
import { Pagination } from '~/helper/paginate/pagination'
import { ParamConfigEntity } from '~/modules/system/param-config/param-config.entity'

import { ParamConfigDto, ParamConfigQueryDto } from './param-config.dto'

@Injectable()
export class ParamConfigService {
  constructor(
    @InjectRepository(ParamConfigEntity)
    private paramConfigRepository: Repository<ParamConfigEntity>,
  ) {}

  /**
   * 罗列所有配置
   */
  async page({
    page,
    pageSize,
    name,
  }: ParamConfigQueryDto): Promise<Pagination<ParamConfigEntity>> {
    const queryBuilder = this.paramConfigRepository.createQueryBuilder('config')

    if (name) {
      queryBuilder.where('config.name LIKE :name', {
        name: `%${name}%`,
      })
    }

    return paginate(queryBuilder, { page, pageSize })
  }

  /**
   * 获取参数总数
   */
  async countConfigList(): Promise<number> {
    return this.paramConfigRepository.count()
  }

  /**
   * 新增
   */
  async create(dto: ParamConfigDto): Promise<void> {
    await this.paramConfigRepository.insert(dto)
  }

  /**
   * 更新
   */
  async update(id: number, dto: Partial<ParamConfigDto>): Promise<void> {
    await this.paramConfigRepository.update(id, dto)
  }

  /**
   * 删除
   */
  async delete(id: number): Promise<void> {
    await this.paramConfigRepository.delete(id)
  }

  /**
   * 查询单个
   */
  async findOne(id: number): Promise<ParamConfigEntity> {
    return this.paramConfigRepository.findOneBy({ id })
  }

  async findValueByKey(key: string): Promise<string | null> {
    const result = await this.paramConfigRepository.findOne({
      where: { key },
      select: ['value'],
    })
    if (result)
      return result.value

    return null
  }
}
