import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Put} from '@nestjs/common';
import {DemoService} from './demo.service';
import {ApiOperation, ApiTags} from '@nestjs/swagger';
import {ApiSecurityAuth} from '~/common/decorators/swagger.decorator';
import {definePermission, Perm} from '~/modules/auth/decorators/permission.decorator';
import {DemoDto, DemoQueryDto, DemoUpdateDto} from '~/modules/demo/demo.dto';
import {ApiResult} from '~/common/decorators/api-result.decorator';
import {Pagination} from '~/helper/paginate/pagination';
import {DemoEntity} from '~/modules/demo/demo.entity';
import {Public} from '~/modules/auth/decorators/public.decorator';
import {TodoEntity} from '~/modules/todo/todo.entity';
import {IdParam} from '~/common/decorators/id-param.decorator';
import {TodoUpdateDto} from '~/modules/todo/todo.dto';
import {Resource} from '~/modules/auth/decorators/resource.decorator';

export const permissions = definePermission('demo', {
    LIST: 'list',
    CREATE: 'create',
    READ: 'read',
    UPDATE: 'update',
    DELETE: 'delete',
} as const);

@ApiTags('Demo - demo模块')
@ApiSecurityAuth()
@Controller('demo')
@Public()
export class DemoController {
    constructor(private readonly demoService: DemoService) {

    }

    @Post()
    @ApiOperation({summary: '新增'})
    @Perm(permissions.CREATE)
    async create(@Body() createDemoDto: DemoDto): Promise<void> {
        await this.demoService.create(createDemoDto);
    }

    @Get()
    @ApiOperation({ summary: '获取列表' })
    @ApiResult({ type: [DemoEntity] })
    @Perm(permissions.LIST)
    async list(@Query() dto: DemoQueryDto): Promise<Pagination<DemoEntity>> {
        return this.demoService.list(dto);
    }

    @Get(':id')
    @ApiOperation({ summary: '获取详情' })
    @ApiResult({ type: DemoEntity })
    @Perm(permissions.READ)
    async info(@IdParam() id: number): Promise<DemoEntity> {
        return this.demoService.detail(id);
    }

    @Put(':id')
    @ApiOperation({ summary: '更新' })
    @Perm(permissions.UPDATE)
    @Resource(TodoEntity)
    async update(@IdParam() id: number, @Body()dto: DemoUpdateDto): Promise<void> {
        await this.demoService.update(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: '删除' })
    @Perm(permissions.DELETE)
    @Resource(DemoEntity)
    async delete(@IdParam() id: number): Promise<void> {
        await this.demoService.delete(id);
    }
}
