import { ApiProperty } from '@nestjs/swagger'
import { IsString, Matches, MaxLength, MinLength } from 'class-validator'

export class PasswordUpdateDto {
  @ApiProperty({ description: '旧密码' })
  @IsString()
  @Matches(/^[\s\S]+$/)
  @MinLength(6)
  @MaxLength(20)
  oldPassword: string

  @ApiProperty({ description: '新密码' })
  @Matches(/^\S*(?=\S{6})(?=\S*\d)(?=\S*[A-Z])\S*$/i, {
    message: '密码必须包含数字、字母，长度为6-16',
  })
  newPassword: string
}

export class UserPasswordDto {
  // @ApiProperty({ description: '管理员/用户ID' })
  // @IsEntityExist(UserEntity, { message: '用户不存在' })
  // @IsInt()
  // id: number

  @ApiProperty({ description: '更改后的密码' })
  @Matches(/^\S*(?=\S{6})(?=\S*\d)(?=\S*[A-Z])\S*$/i, {
    message: '密码格式不正确',
  })
  password: string
}

export class UserExistDto {
  @ApiProperty({ description: '登录账号' })
  @IsString()
  @Matches(/^[\w-]{4,16}$/)
  @MinLength(6)
  @MaxLength(20)
  username: string
}
