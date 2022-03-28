import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';
import { SocketException } from 'src/common/exceptions/socket.exception';
import { AuthService } from './auth.service';

@Injectable()
export class AdminWsGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const client = context.switchToWs().getClient<Socket>();
    const token = client?.handshake?.query?.token;
    try {
      // 挂载对象到当前请求上
      this.authService.checkAdminAuthToken(token);
      return true;
    } catch (e) {
      // close
      client.disconnect();
      // 无法通过token校验
      throw new SocketException(11001);
    }
  }
}
