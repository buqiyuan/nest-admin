import { ApiProperty } from '@nestjs/swagger'

export class LoginLogInfo {
  @ApiProperty({ description: '日志编号' })
  id: number

  @ApiProperty({ description: '登录ip', example: '1.1.1.1' })
  ip: string

  @ApiProperty({ description: '登录地址' })
  address: string

  @ApiProperty({ description: '系统', example: 'Windows 10' })
  os: string

  @ApiProperty({ description: '浏览器', example: 'Chrome' })
  browser: string

  @ApiProperty({ description: '登录用户名', example: 'admin' })
  username: string

  @ApiProperty({ description: '登录时间', example: '2023-12-22 16:46:20.333843' })
  time: string
}

export class TaskLogInfo {
  @ApiProperty({ description: '日志编号' })
  id: number

  @ApiProperty({ description: '任务编号' })
  taskId: number

  @ApiProperty({ description: '任务名称' })
  name: string

  @ApiProperty({ description: '创建时间' })
  createdAt: string

  @ApiProperty({ description: '耗时' })
  consumeTime: number

  @ApiProperty({ description: '执行信息' })
  detail: string

  @ApiProperty({ description: '任务执行状态' })
  status: number
}
