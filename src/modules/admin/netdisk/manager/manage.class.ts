import { ApiProperty } from '@nestjs/swagger';

export type FileType = 'file' | 'dir';

export class SFileInfo {
  @ApiProperty({ description: '文件id' })
  id: string;

  @ApiProperty({ description: '文件类型', enum: ['file', 'dir'] })
  type: FileType;

  @ApiProperty({ description: '文件名称' })
  name: string;

  @ApiProperty({ description: '存入时间', type: Date })
  putTime?: Date;

  @ApiProperty({ description: '文件大小, byte单位' })
  fsize?: string;

  @ApiProperty({ description: '文件的mime-type' })
  mimeType?: string;

  @ApiProperty({ description: '所属目录' })
  belongTo?: string;
}

export class SFileList {
  @ApiProperty({ description: '文件列表', type: [SFileInfo] })
  list: SFileInfo[];

  @ApiProperty({ description: '分页标志，空则代表加载完毕' })
  marker?: string;
}

export class UploadToken {
  @ApiProperty({ description: '上传token' })
  token: string;
}

export class SFileInfoDetail {
  @ApiProperty({ description: '文件大小，int64类型，单位为字节（Byte）' })
  fsize: number;

  @ApiProperty({ description: '文件HASH值' })
  hash: string;

  @ApiProperty({ description: '文件MIME类型，string类型' })
  mimeType: string;

  @ApiProperty({
    description:
      '文件存储类型，2 表示归档存储，1 表示低频存储，0表示普通存储。',
  })
  type: number;

  @ApiProperty({ description: '文件上传时间', type: Date })
  putTime: Date;

  @ApiProperty({ description: '文件md5值' })
  md5: string;

  @ApiProperty({ description: '上传人' })
  uploader: string;

  @ApiProperty({ description: '文件备注' })
  mark?: string;
}
