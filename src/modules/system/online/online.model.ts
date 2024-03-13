import { ApiProperty, OmitType } from '@nestjs/swagger'

import { LoginLogInfo } from '../log/models/log.model'

export class OnlineUserInfo extends OmitType(LoginLogInfo, ['id'] as const) {
  @ApiProperty({ description: 'tokenId' })
  tokenId: string

  @ApiProperty({ description: '部门名称' })
  deptName: string

  @ApiProperty({ description: '用户ID' })
  uid: number

  @ApiProperty({ description: '是否为当前登录用户' })
  isCurrent?: boolean

  @ApiProperty({ description: '不允许踢当前用户或超级管理员下线' })
  disable?: boolean
}
