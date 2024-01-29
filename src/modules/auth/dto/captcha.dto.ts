import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsEmail,
  IsInt,
  IsMobilePhone,
  IsOptional,
  IsString,
} from 'class-validator'

export class ImageCaptchaDto {
  @ApiProperty({
    required: false,
    default: 100,
    description: '验证码宽度',
  })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  readonly width: number = 100

  @ApiProperty({
    required: false,
    default: 50,
    description: '验证码宽度',
  })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  readonly height: number = 50
}

export class SendEmailCodeDto {
  @ApiProperty({ description: '邮箱' })
  @IsEmail({}, { message: '邮箱格式不正确' })
  email: string
}

export class SendSmsCodeDto {
  @ApiProperty({ description: '手机号' })
  @IsMobilePhone('zh-CN', {}, { message: '手机号格式不正确' })
  phone: string
}

export class CheckCodeDto {
  @ApiProperty({ description: '手机号/邮箱' })
  @IsString()
  account: string

  @ApiProperty({ description: '验证码' })
  @IsString()
  code: string
}
