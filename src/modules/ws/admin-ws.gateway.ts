import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from './auth.service';
import { EVENT_OFFLINE, EVENT_ONLINE } from './ws.event';

/**
 * Admin WebSokcet网关，不含权限校验，Socket端只做通知相关操作
 */
@WebSocketGateway()
export class AdminWSGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer()
  private wss: Server;

  get socketServer(): Server {
    return this.wss;
  }

  constructor(private authService: AuthService) {}

  /**
   * OnGatewayInit
   * @param server Server
   */
  afterInit() {
    // TODO
  }

  /**
   * OnGatewayConnection
   */
  async handleConnection(client: Socket): Promise<void> {
    try {
      this.authService.checkAdminAuthToken(client.handshake?.query?.token);
    } catch (e) {
      // no auth
      client.disconnect();
      return;
    }

    // broadcast online
    client.broadcast.emit(EVENT_ONLINE);
  }

  /**
   * OnGatewayDisconnect
   */
  async handleDisconnect(client: Socket): Promise<void> {
    // TODO
    client.broadcast.emit(EVENT_OFFLINE);
  }
}
