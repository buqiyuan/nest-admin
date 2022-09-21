import { IoAdapter } from '@nestjs/platform-socket.io';
import { INestApplicationContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// https://stackoverflow.com/questions/69435506/how-to-pass-a-dynamic-port-to-the-websockets-gateway-in-nestjs
export class SocketIoAdapter extends IoAdapter {
  constructor(
    private app: INestApplicationContext,
    private configService: ConfigService,
  ) {
    super(app);
  }

  create(port: number, options?: any) {
    port = this.configService.get<number>('WS_PORT');
    options.path = this.configService.get<string>('WS_PATH');
    options.namespace = '/admin';
    return super.create(port, options);
  }

  createIOServer(port: number, options?: any) {
    port = this.configService.get<number>('WS_PORT');
    options.path = this.configService.get<string>('WS_PATH');
    options.namespace = '/admin';
    return super.createIOServer(port, options);
  }
}
