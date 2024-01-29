import type { Socket } from 'socket.io'

import { BusinessEvents } from './business-event.constant'

export abstract class BaseGateway {
  public gatewayMessageFormat(
    type: BusinessEvents,
    message: any,
    code?: number,
  ) {
    return {
      type,
      data: message,
      code,
    }
  }

  handleDisconnect(client: Socket) {
    client.send(
      this.gatewayMessageFormat(BusinessEvents.GATEWAY_CONNECT, 'WebSocket 断开'),
    )
  }

  handleConnect(client: Socket) {
    client.send(
      this.gatewayMessageFormat(BusinessEvents.GATEWAY_CONNECT, 'WebSocket 已连接'),
    )
  }
}

export abstract class BroadcastBaseGateway extends BaseGateway {
  broadcast(event: BusinessEvents, data: any) {}
}
