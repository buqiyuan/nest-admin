import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { PageResult } from 'src/common/class/res.class';
import { PageOptionsDto } from 'src/common/dto/page.dto';
import SysConfig from 'src/entities/admin/sys-config.entity';
import { ADMIN_PREFIX } from '../../admin.constants';
import {
  CreateParamConfigDto,
  DeleteParamConfigDto,
  InfoParamConfigDto,
  UpdateParamConfigDto,
} from './param-config.dto';
import { SysParamConfigService } from './param-config.service';

@ApiSecurity(ADMIN_PREFIX)
@ApiTags('参数配置模块')
@Controller('param-config')
export class SysParamConfigController {
  constructor(private paramConfigService: SysParamConfigService) {}

  @ApiOperation({ summary: '分页获取参数配置列表' })
  @ApiOkResponse({ type: [SysConfig] })
  @Get('page')
  async page(@Query() dto: PageOptionsDto): Promise<PageResult<SysConfig>> {
    const list = await this.paramConfigService.getConfigListByPage(
      dto.page - 1,
      dto.limit,
    );
    const count = await this.paramConfigService.countConfigList();
    return {
      pagination: {
        total: count,
        size: dto.limit,
        page: dto.page,
      },
      list,
    };
  }

  @ApiOperation({ summary: '新增参数配置' })
  @Post('add')
  async add(@Body() dto: CreateParamConfigDto): Promise<void> {
    await this.paramConfigService.isExistKey(dto.key);
    await this.paramConfigService.add(dto);
  }

  @ApiOperation({ summary: '查询单个参数配置信息' })
  @ApiOkResponse({ type: SysConfig })
  @Get('info')
  async info(@Query() dto: InfoParamConfigDto): Promise<SysConfig> {
    return this.paramConfigService.findOne(dto.id);
  }

  @ApiOperation({ summary: '更新单个参数配置' })
  @Post('update')
  async update(@Body() dto: UpdateParamConfigDto): Promise<void> {
    await this.paramConfigService.update(dto);
  }

  @ApiOperation({ summary: '删除指定的参数配置' })
  @Post('delete')
  async delete(@Body() dto: DeleteParamConfigDto): Promise<void> {
    await this.paramConfigService.delete(dto.ids);
  }
}
