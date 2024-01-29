import { BeforeApplicationShutdown, Controller, Param, ParseIntPipe, Req, Res, Sse } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
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

  @Sse(':uid')
  sse(@Param('uid', ParseIntPipe) uid: number, @Req() req: FastifyRequest, @Res() res: FastifyReply): Observable<MessageEvent> {
    this.replyMap.set(uid, res)

    const subscription = interval(10000).subscribe(() => {
      this.sseService.sendToClient(uid, { type: 'ping' })
    })

    // 当客户端断开连接时
    req.raw.on('close', () => {
      subscription.unsubscribe()
      this.sseService.removeClient(uid)
      this.replyMap.delete(uid)
      // console.log(`user-${uid}已关闭`)
    })

    return new Observable((subscriber) => {
      this.sseService.addClient(uid, subscriber)
    })
  }
}
