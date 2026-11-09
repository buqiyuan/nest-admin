import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import dayjs from 'dayjs'
import { isNil } from 'lodash'
import { Repository } from 'typeorm'

import { Storage } from '~/modules/tools/storage/storage.entity'

import {
  fileRename,
  getExtname,
  getFilePath,
  getFileType,
  getSize,
  saveLocalFile,
} from '~/utils/file.util'

@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(Storage)
    private storageRepository: Repository<Storage>,
  ) {}

  /**
   * 保存文件上传记录。
   * platform-node 的 FileInterceptor 使用 Multer 内存存储，文件在 file.buffer。
   */
  async saveFile(file: Express.Multer.File, userId: number): Promise<string> {
    if (isNil(file))
      throw new NotFoundException('Have not any file to upload!')

    const fileName = file.originalname
    const size = getSize(file.size)
    const extName = getExtname(fileName)
    const type = getFileType(extName)
    const name = fileRename(fileName)
    const currentDate = dayjs().format('YYYY-MM-DD')
    const path = getFilePath(name, currentDate, type)

    await saveLocalFile(file.buffer, name, currentDate, type)

    await this.storageRepository.save({
      name,
      fileName,
      extName,
      path,
      type,
      size,
      userId,
    })

    return path
  }
}
