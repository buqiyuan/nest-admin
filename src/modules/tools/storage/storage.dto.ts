import { ApiProperty } from '@nestjs/swagger'
import { ArrayNotEmpty, IsArray, IsOptional, IsString } from 'class-validator'

import { PagerDto } from '~/common/dto/pager.dto'

export class StoragePageDto extends PagerDto {
  @ApiProperty({ description: '文件名' })
  @IsOptional()
  @IsString()
  name: string

  @ApiProperty({ description: '文件后缀' })
  @IsString()
  @IsOptional()
  extName: string

  @ApiProperty({ description: '文件类型' })
  @IsString()
  @IsOptional()
  type: string

  @ApiProperty({ description: '大小' })
  @IsString()
  @IsOptional()
  size: string

  @ApiProperty({ description: '上传时间' })
  @IsOptional()
  time: string[]

  @ApiProperty({ description: '上传者' })
  @IsString()
  @IsOptional()
  username: string
}

export class StorageCreateDto {
  @ApiProperty({ description: '文件名' })
  @IsString()
  name: string

  @ApiProperty({ description: '真实文件名' })
  @IsString()
  fileName: string

  @ApiProperty({ description: '文件扩展名' })
  @IsString()
  extName: string

  @ApiProperty({ description: '文件路径' })
  @IsString()
  path: string

  @ApiProperty({ description: '文件路径' })
  @IsString()
  type: string

  @ApiProperty({ description: '文件大小' })
  @IsString()
  size: string
}

export class StorageDeleteDto {
  @ApiProperty({ description: '需要删除的文件ID列表', type: [Number] })
  @IsArray()
  @ArrayNotEmpty()
  ids: number[]
}
