import { ApiProperty } from '@nestjs/swagger'

export class ImageCaptcha {
  @ApiProperty({ description: 'base64格式的svg图片' })
  img: string

  @ApiProperty({ description: '验证码对应的唯一ID' })
  id: string
}

export class LoginToken {
  @ApiProperty({ description: 'JWT身份Token' })
  token: string
}
