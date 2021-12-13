import {
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { NetDiskManageService } from './manage.service';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import {
  DeleteDto,
  FileInfoDto,
  FileOpDto,
  GetFileListDto,
  MarkFileDto,
  MKDirDto,
  RenameDto,
} from './manage.dto';
import { SFileInfoDetail, SFileList, UploadToken } from './manage.class';
import { ApiException } from 'src/common/exceptions/api.exception';
import { AdminUser } from '../../core/decorators/admin-user.decorator';
import { IAdminUser } from '../../admin.interface';
import { ADMIN_PREFIX } from '../../admin.constants';

@ApiSecurity(ADMIN_PREFIX)
@ApiTags('网盘管理模块')
@Controller('manage')
export class NetDiskManageController {
  constructor(private manageService: NetDiskManageService) {}

  @ApiOperation({ summary: '获取文件列表' })
  @ApiOkResponse({ type: SFileList })
  @Get('list')
  async list(@Query() dto: GetFileListDto): Promise<SFileList> {
    return await this.manageService.getFileList(dto.path, dto.marker, dto.key);
  }

  @ApiOperation({ summary: '创建文件夹，支持多级' })
  @Post('mkdir')
  async mkdir(@Body() dto: MKDirDto): Promise<void> {
    const result = await this.manageService.checkFileExist(
      `${dto.path}${dto.dirName}/`,
    );
    if (result) {
      throw new ApiException(20001);
    }
    await this.manageService.createDir(`${dto.path}${dto.dirName}`);
  }

  @ApiOperation({ summary: '获取上传Token，无Token前端无法上传' })
  @ApiOkResponse({ type: UploadToken })
  @Get('token')
  async token(@AdminUser() user: IAdminUser): Promise<UploadToken> {
    return {
      token: this.manageService.createUploadToken(`${user.uid}`),
    };
  }

  @ApiOperation({ summary: '获取文件详细信息' })
  @ApiOkResponse({ type: SFileInfoDetail })
  @Post('info')
  async info(@Body() dto: FileInfoDto): Promise<SFileInfoDetail> {
    return await this.manageService.getFileInfo(dto.name, dto.path);
  }

  @ApiOperation({ summary: '添加文件备注' })
  @Post('mark')
  async mark(@Body() dto: MarkFileDto): Promise<void> {
    await this.manageService.changeFileHeaders(dto.name, dto.path, {
      mark: dto.mark,
    });
  }

  @ApiOperation({ summary: '获取下载链接，不支持下载文件夹' })
  @ApiOkResponse({ type: String })
  @Post('download')
  async download(@Body() dto: FileInfoDto): Promise<string> {
    return this.manageService.getDownloadLink(`${dto.path}${dto.name}`);
  }

  @ApiOperation({ summary: '重命名文件或文件夹' })
  @Post('rename')
  async rename(@Body() dto: RenameDto): Promise<void> {
    const result = await this.manageService.checkFileExist(
      `${dto.path}${dto.toName}${dto.type === 'dir' ? '/' : ''}`,
    );
    if (result) {
      throw new ApiException(20001);
    }
    if (dto.type === 'file') {
      await this.manageService.renameFile(dto.path, dto.name, dto.toName);
    } else {
      await this.manageService.renameDir(dto.path, dto.name, dto.toName);
    }
  }

  @ApiOperation({ summary: '删除文件或文件夹' })
  @Post('delete')
  async delete(@Body() dto: DeleteDto): Promise<void> {
    await this.manageService.deleteMultiFileOrDir(dto.files, dto.path);
  }

  @ApiOperation({ summary: '剪切文件或文件夹，支持批量' })
  @Post('cut')
  async cut(@Body() dto: FileOpDto): Promise<void> {
    if (dto.originPath === dto.toPath) {
      throw new ApiException(20002);
    }
    await this.manageService.moveMultiFileOrDir(
      dto.files,
      dto.originPath,
      dto.toPath,
    );
  }

  @ApiOperation({ summary: '复制文件或文件夹，支持批量' })
  @Post('copy')
  async copy(@Body() dto: FileOpDto): Promise<void> {
    await this.manageService.copyMultiFileOrDir(
      dto.files,
      dto.originPath,
      dto.toPath,
    );
  }
}
