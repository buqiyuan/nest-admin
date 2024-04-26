import {Controller, Get, Post, Body, Patch, Param, Delete} from '@nestjs/common';
import {DemoService} from './demo.service';
import {CreateDemoDto} from './dto/create-demo.dto';
import {DemoDto} from './dto/demo.dto';
import {ApiOperation, ApiTags} from '@nestjs/swagger';
import {ApiSecurityAuth} from '~/common/decorators/swagger.decorator';
import {definePermission, Perm} from '~/modules/auth/decorators/permission.decorator';

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
export class DemoController {
    constructor(private readonly demoService: DemoService) {
    }

    @Post()
    @ApiOperation({summary: '新增'})
    @Perm(permissions.CREATE)
    async create(@Body() createDemoDto: CreateDemoDto): Promise<void> {
        await this.demoService.create(createDemoDto);
    }

    @Get()
    findAll() {
        return this.demoService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.demoService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateDemoDto: DemoDto) {
        return this.demoService.update(+id, updateDemoDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.demoService.remove(+id);
    }
}
