import { Module } from '@nestjs/common';
import { AdminWSGateway } from './admin-ws.gateway';
import { AuthService } from './auth.service';

const providers = [AdminWSGateway, AuthService];

/**
 * WebSocket Module
 */
@Module({
  providers,
  exports: providers,
})
export class WSModule {}
