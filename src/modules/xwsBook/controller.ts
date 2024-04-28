import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Put} from '@nestjs/common';
import {ApiOperation, ApiTags} from '@nestjs/swagger';
import {ApiSecurityAuth} from '~/common/decorators/swagger.decorator';
import {definePermission, Perm} from '~/modules/auth/decorators/permission.decorator';
import {ApiResult} from '~/common/decorators/api-result.decorator';
import {Pagination} from '~/helper/paginate/pagination';
import {Public} from '~/modules/auth/decorators/public.decorator';
import {IdParam} from '~/common/decorators/id-param.decorator';
import {Resource} from '~/modules/auth/decorators/resource.decorator';
import {Dto, QueryDto, UpdateDto} from './dto';
import {Service} from './service';
import {_Entity as Entity} from './entity';

// 定义模块名(中文)
const entityName = 'XWS书';
const entityNameEn = 'xwsBook';


export const permissions = definePermission(entityName, {
    LIST: 'list',
    CREATE: 'create',
    READ: 'read',
    UPDATE: 'update',
    DELETE: 'delete',
} as const);


@ApiTags(entityNameEn + '-' + entityName + '模块')
@Controller(entityNameEn)
@ApiSecurityAuth()
@Public()
export class _Controller {
    constructor(private readonly service: Service) {

    }

    @Post()
    @ApiOperation({summary: '新增' + entityName})
    @Perm(permissions.CREATE)
    async create(@Body() createDto: Dto): Promise<void> {
        await this.service.create(createDto);
    }

    @Get()
    @ApiOperation({summary: '获取' + entityName + '列表'})
    @ApiResult({type: [Entity]})
    @Perm(permissions.LIST)
    async list(@Query() dto: QueryDto): Promise<Pagination<Entity>> {
        return this.service.list(dto);
    }

    @Get(':id')
    @ApiOperation({summary: '获取' + entityName + '详情'})
    @ApiResult({type: Entity})
    @Perm(permissions.READ)
    async info(@IdParam() id: number): Promise<Entity> {
        return this.service.detail(id);
    }

    @Put(':id')
    @ApiOperation({summary: '更新' + entityName})
    @Resource(Entity)
    @Perm(permissions.UPDATE)
    async update(@IdParam() id: number, @Body() dto: UpdateDto): Promise<void> {
        await this.service.update(id, dto);
    }

    @Delete(':id')
    @ApiOperation({summary: '删除' + entityName})
    @Resource(Entity)
    @Perm(permissions.DELETE)
    async delete(@IdParam() id: number): Promise<void> {
        await this.service.delete(id);
    }
}
