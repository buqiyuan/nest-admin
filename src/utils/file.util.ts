import fs from 'node:fs'
import path from 'node:path'

import { MultipartFile } from '@fastify/multipart'

import dayjs from 'dayjs'

enum Type {
  IMAGE = '图片',
  TXT = '文档',
  MUSIC = '音乐',
  VIDEO = '视频',
  OTHER = '其他',
}

export function getFileType(extName: string) {
  const documents = 'txt doc pdf ppt pps xlsx xls docx'
  const music = 'mp3 wav wma mpa ram ra aac aif m4a'
  const video = 'avi mpg mpe mpeg asf wmv mov qt rm mp4 flv m4v webm ogv ogg'
  const image
    = 'bmp dib pcp dif wmf gif jpg tif eps psd cdr iff tga pcd mpt png jpeg'
  if (image.includes(extName))
    return Type.IMAGE

  if (documents.includes(extName))
    return Type.TXT

  if (music.includes(extName))
    return Type.MUSIC

  if (video.includes(extName))
    return Type.VIDEO

  return Type.OTHER
}

export function getName(fileName: string) {
  if (fileName.includes('.'))
    return fileName.split('.')[0]

  return fileName
}

export function getExtname(fileName: string) {
  return path.extname(fileName).replace('.', '')
}

export function getSize(bytes: number, decimals = 2) {
  if (bytes === 0)
    return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${Number.parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`
}

export function fileRename(fileName: string) {
  const name = fileName.split('.')[0]
  const extName = path.extname(fileName)
  const time = dayjs().format('YYYYMMDDHHmmSSS')
  return `${name}-${time}${extName}`
}

export function getFilePath(name: string) {
  return `/upload/${name}`
}

export function saveLocalFile(buffer: Buffer, name: string) {
  const filePath = path.join(__dirname, '../../', 'public/upload', name)
  const writeStream = fs.createWriteStream(filePath)
  writeStream.write(buffer)
}

export async function saveFile(file: MultipartFile, name: string) {
  const filePath = path.join(__dirname, '../../', 'public/upload', name)
  const writeStream = fs.createWriteStream(filePath)
  const buffer = await file.toBuffer()
  writeStream.write(buffer)
}

export async function deleteFile(name: string) {
  fs.unlink(path.join(__dirname, '../../', 'public', name), () => {
    // console.log(error);
  })
}
