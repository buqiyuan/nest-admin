import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiException } from 'src/common/exceptions/api.exception';
import SysConfig from 'src/entities/admin/sys-config.entity';
import { Repository } from 'typeorm';
import { CreateParamConfigDto, UpdateParamConfigDto } from './param-config.dto';

@Injectable()
export class SysParamConfigService {
  constructor(
    @InjectRepository(SysConfig)
    private configRepository: Repository<SysConfig>,
  ) {}

  /**
   * 罗列所有配置
   */
  async getConfigListByPage(page: number, count: number): Promise<SysConfig[]> {
    return this.configRepository.find({
      order: {
        id: 'ASC',
      },
      take: count,
      skip: page * count,
    });
  }

  /**
   * 获取参数总数
   */
  async countConfigList(): Promise<number> {
    return this.configRepository.count();
  }

  /**
   * 新增
   */
  async add(dto: CreateParamConfigDto): Promise<void> {
    await this.configRepository.insert(dto);
  }

  /**
   * 更新
   */
  async update(dto: UpdateParamConfigDto): Promise<void> {
    await this.configRepository.update(
      { id: dto.id },
      { name: dto.name, value: dto.value, remark: dto.remark },
    );
  }

  /**
   * 删除
   */
  async delete(ids: number[]): Promise<void> {
    await this.configRepository.delete(ids);
  }

  /**
   * 查询单个
   */
  async findOne(id: number): Promise<SysConfig> {
    return await this.configRepository.findOne({ where: { id } });
  }

  async isExistKey(key: string): Promise<void | never> {
    const result = await this.configRepository.findOne({ where: { key } });
    if (result) {
      throw new ApiException(10021);
    }
  }

  async findValueByKey(key: string): Promise<string | null> {
    const result = await this.configRepository.findOne({
      where: { key },
      select: ['value'],
    });
    if (result) {
      return result.value;
    }
    return null;
  }
}
