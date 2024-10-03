import type {
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets'
import type { Socket } from 'socket.io'
import { } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { JwtService } from '@nestjs/jwt'
import { WebSocketServer } from '@nestjs/websockets'
import { Namespace } from 'socket.io'

import { EventBusEvents } from '~/constants/event-bus.constant'

import { TokenService } from '~/modules/auth/services/token.service'
import { CacheService } from '~/shared/redis/cache.service'

import { BroadcastBaseGateway } from '../base.gateway'
import { BusinessEvents } from '../business-event.constant'

export interface AuthGatewayOptions {
  namespace: string
}

// eslint-disable-next-line ts/ban-ts-comment
// @ts-expect-error
export interface IAuthGateway extends OnGatewayConnection, OnGatewayDisconnect, BroadcastBaseGateway {}

export function createAuthGateway(options: AuthGatewayOptions): new (...args: any[]) => IAuthGateway {
  const { namespace } = options

  class AuthGateway extends BroadcastBaseGateway implements IAuthGateway {
    constructor(
      protected readonly jwtService: JwtService,
      protected readonly tokenService: TokenService,
      private readonly cacheService: CacheService,
    ) {
      super()
    }

    @WebSocketServer()
    protected namespace: Namespace

    async authFailed(client: Socket) {
      client.send(
        this.gatewayMessageFormat(BusinessEvents.AUTH_FAILED, '认证失败'),
      )
      client.disconnect()
    }

    async authToken(token: string): Promise<boolean> {
      if (typeof token !== 'string')
        return false

      const validJwt = async () => {
        try {
          const ok = await this.jwtService.verifyAsync(token)

          if (!ok)
            return false
        }
        catch {
          return false
        }
        // is not crash, is verify
        return true
      }

      return await validJwt()
    }

    async handleConnection(client: Socket) {
      const token
        = client.handshake.query.token
        || client.handshake.headers.authorization
        || client.handshake.headers.Authorization
      if (!token)
        return this.authFailed(client)

      if (!(await this.authToken(token as string)))
        return this.authFailed(client)

      super.handleConnect(client)

      const sid = client.id
      this.tokenSocketIdMap.set(token.toString(), sid)
    }

    handleDisconnect(client: Socket) {
      super.handleDisconnect(client)
    }

    tokenSocketIdMap = new Map<string, string>()

    @OnEvent(EventBusEvents.TokenExpired)
    handleTokenExpired(token: string) {
      // consola.debug(`token expired: ${token}`)

      const server = this.namespace.server
      const sid = this.tokenSocketIdMap.get(token)
      if (!sid)
        return false

      const socket = server.of(`/${namespace}`).sockets.get(sid)
      if (socket) {
        socket.disconnect()
        super.handleDisconnect(socket)
        return true
      }
      return false
    }

    override broadcast(event: BusinessEvents, data: any) {
      this.cacheService.emitter.of(`/${namespace}`).emit('message', this.gatewayMessageFormat(event, data))
    }
  }

  return AuthGateway
}
