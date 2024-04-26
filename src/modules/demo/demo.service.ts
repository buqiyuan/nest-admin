import {Injectable} from '@nestjs/common';
import {isEmpty} from 'lodash';
import {BusinessException} from '~/common/exceptions/biz.exception';
import {ErrorEnum} from '~/constants/error-code.constant';
import {md5, randomValue} from '~/utils';
import {SYS_USER_INITPASSWORD} from '~/constants/system.constant';
import {EntityManager, In, Repository} from 'typeorm';
import {DeptEntity} from '~/modules/system/dept/dept.entity';
import {InjectRedis} from '@songkeys/nestjs-redis';
import Redis from 'ioredis';
import {InjectEntityManager, InjectRepository} from '@nestjs/typeorm';
import {RoleEntity} from '~/modules/system/role/role.entity';
import {ParamConfigService} from '~/modules/system/param-config/param-config.service';
import {QQService} from '~/shared/helper/qq.service';
import {DemoEntity} from '~/modules/demo/demo.entity';
import {DemoDto} from '~/modules/demo/demo.dto';

@Injectable()
export class DemoService {
    constructor(
        @InjectRepository(DemoEntity)
        private readonly demoRepository: Repository<DemoEntity>
    ) {
    }


    async create(createDemoDto: DemoDto): Promise<void> {
        const result = await this.demoRepository.save(createDemoDto);
        return result;
    }

    findAll() {
        return 'This action returns all demo';
    }

    findOne(id: number) {
        return `This action returns a #${id} demo`;
    }

    update(id: number, updateDemoDto: DemoDto) {
        return `This action updates a #${id} demo`;
    }

    remove(id: number) {
        return `This action removes a #${id} demo`;
    }
}
