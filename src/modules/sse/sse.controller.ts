import type { NodeRequest, NodeResponse } from '@nestjs/platform-node'
import { BeforeApplicationShutdown, Controller, Headers, Ip, Param, ParseIntPipe, Req, Res, Sse } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { SkipThrottle } from '@nestjs/throttler'

import { interval, Observable } from 'rxjs'

import { ApiSecurityAuth } from '~/common/decorators/swagger.decorator'

import { OnlineService } from '../system/online/online.service'
import { MessageEvent, SseService } from './sse.service'

@ApiTags('System - sse模块')
@ApiSecurityAuth()
@SkipThrottle()
@Controller('sse')
export class SseController implements BeforeApplicationShutdown {
  private replyMap: Map<number, NodeResponse> = new Map()

  constructor(private readonly sseService: SseService, private onlineService: OnlineService) { }

  private closeAllConnect() {
    this.sseService.sendToAllUser({
      type: 'close',
      data: 'bye~',
    })
    this.replyMap.forEach((res) => {
      res.end()
      res.socket?.destroy()
    })
    this.replyMap.clear()
  }

  // 通过控制台关闭程序时触发
  beforeApplicationShutdown() {
    this.closeAllConnect()
  }

  @ApiOperation({ summary: '服务端推送消息' })
  @Sse(':uid')
  async sse(
    @Param('uid', ParseIntPipe) uid: number,
    @Req() req: NodeRequest,
    @Res({ passthrough: true }) res: NodeResponse,
    @Ip() ip: string,
    @Headers('user-agent') ua: string,
  ): Promise<Observable<MessageEvent>> {
    this.replyMap.set(uid, res)
    this.onlineService.addOnlineUser(req.accessToken, ip, ua)

    return new Observable((subscriber) => {
      // 定时推送，保持连接
      const subscription = interval(12000).subscribe(() => {
        subscriber.next({ type: 'ping' })
      })
      this.sseService.addClient(uid, subscriber)

      // 当客户端断开连接时。请求对象本身就是 IncomingMessage，没有 Fastify 的 req.raw。
      req.on('close', () => {
        subscription.unsubscribe()
        this.sseService.removeClient(uid, subscriber)
        this.replyMap.delete(uid)
        this.onlineService.removeOnlineUser(req.accessToken)
        console.log(`user-${uid}已关闭`)
      })
    })
  }
}
