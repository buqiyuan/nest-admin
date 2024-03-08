import { BeforeApplicationShutdown, Controller, Param, ParseIntPipe, Req, Res, Sse } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { FastifyReply, FastifyRequest } from 'fastify'
import { Observable, interval } from 'rxjs'

import { ApiSecurityAuth } from '~/common/decorators/swagger.decorator'

import { MessageEvent, SseService } from './sse.service'

@ApiTags('System - sse模块')
@ApiSecurityAuth()
@Controller('sse')
export class SseController implements BeforeApplicationShutdown {
  private replyMap: Map<number, FastifyReply> = new Map()

  constructor(private readonly sseService: SseService) {}

  private closeAllConnect() {
    this.sseService.sendToAll({
      type: 'close',
      data: 'bye~',
    })
    this.replyMap.forEach((reply) => {
      reply.raw.end().destroy()
    })
  }

  // 通过控制台关闭程序时触发
  beforeApplicationShutdown() {
    // console.log('beforeApplicationShutdown')
    this.closeAllConnect()
  }

  @ApiOperation({ summary: '服务端推送消息' })
  @Sse(':uid')
  sse(@Param('uid', ParseIntPipe) uid: number, @Req() req: FastifyRequest, @Res() res: FastifyReply): Observable<MessageEvent> {
    this.replyMap.set(uid, res)

    const subscription = interval(10000).subscribe(() => {
      this.sseService.sendToClient(uid, { type: 'ping' })
    })

    return new Observable((subscriber) => {
      // console.log(`user-${uid}已连接`)
      this.sseService.addClient(uid, subscriber)

      // 当客户端断开连接时
      req.raw.on('close', () => {
        subscription.unsubscribe()
        this.sseService.removeClient(uid, subscriber)
        this.replyMap.delete(uid)
      // console.log(`user-${uid}已关闭`)
      })
    })
  }
}
