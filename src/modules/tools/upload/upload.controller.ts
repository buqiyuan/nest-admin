import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-node'
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger'

import { ApiSecurityAuth } from '~/common/decorators/swagger.decorator'
import { AuthUser } from '~/modules/auth/decorators/auth-user.decorator'

import { definePermission, Perm } from '~/modules/auth/decorators/permission.decorator'

import { FileUploadDto } from './upload.dto'
import { UploadService } from './upload.service'

export const permissions = definePermission('upload', {
  UPLOAD: 'upload',
} as const)

/** 与旧 @fastify/multipart 的 fileSize 限制一致。 */
export const UPLOAD_MAX_FILE_SIZE = 1024 * 1024 * 6

@ApiSecurityAuth()
@ApiTags('Tools - 上传模块')
@Controller('upload')
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Post()
  @Perm(permissions.UPLOAD)
  @ApiOperation({ summary: '上传' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: FileUploadDto,
  })
  @UseInterceptors(FileInterceptor('file', {
    limits: { fileSize: UPLOAD_MAX_FILE_SIZE },
  }))
  async upload(@UploadedFile() file: Express.Multer.File, @AuthUser() user: IAuthUser) {
    if (!file)
      throw new BadRequestException('Request is not multipart')

    try {
      const path = await this.uploadService.saveFile(file, user.uid)

      return {
        filename: path,
      }
    }
    catch (error) {
      console.log(error)
      throw new BadRequestException('上传失败')
    }
  }
}
