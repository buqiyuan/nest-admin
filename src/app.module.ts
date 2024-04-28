import {ClassSerializerInterceptor, MiddlewareConsumer, Module, NestModule} from '@nestjs/common';

import {ConfigModule} from '@nestjs/config';
import {APP_FILTER, APP_GUARD, APP_INTERCEPTOR} from '@nestjs/core';

import {ThrottlerGuard, ThrottlerModule, seconds} from '@nestjs/throttler';

import config from '~/config';
import {SharedModule} from '~/shared/shared.module';

import {AllExceptionsFilter} from './common/filters/any-exception.filter';

import {IdempotenceInterceptor} from './common/interceptors/idempotence.interceptor';
import {TimeoutInterceptor} from './common/interceptors/timeout.interceptor';
import {TransformInterceptor} from './common/interceptors/transform.interceptor';
import {AuthModule} from './modules/auth/auth.module';
import {JwtAuthGuard} from './modules/auth/guards/jwt-auth.guard';
import {RbacGuard} from './modules/auth/guards/rbac.guard';
import {HealthModule} from './modules/health/health.module';
import {NetdiskModule} from './modules/netdisk/netdisk.module';
import {SseModule} from './modules/sse/sse.module';
import {SystemModule} from './modules/system/system.module';
import {TasksModule} from './modules/tasks/tasks.module';
import {TodoModule} from './modules/todo/todo.module';
import {ToolsModule} from './modules/tools/tools.module';
import {DatabaseModule} from './shared/database/database.module';

import {SocketModule} from './socket/socket.module';
import {ChatModule} from '~/modules/AI/chat/chat.module';
import {LoggerMiddleware} from '~/common/middleware/LoggerMiddleware';
import {BaseModule} from '~/modules/base/base.module';
import {XwsbookModule} from '~/modules/xwsBook/module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            expandVariables: true,
            // 指定多个 env 文件时，第一个优先级最高
            envFilePath: ['.env.local', `.env.${process.env.NODE_ENV}`, '.env'],
            load: [...Object.values(config)],
        }),
        // 避免暴力请求，限制同一个接口 10 秒内不能超过 7 次请求
        ThrottlerModule.forRootAsync({
            useFactory: () => ({
                errorMessage: '当前操作过于频繁，请稍后再试！',
                throttlers: [
                    {ttl: seconds(10), limit: 7},
                ],
            }),

        }),
        SharedModule,
        DatabaseModule,

        AuthModule,
        SystemModule,
        TasksModule.forRoot(),
        ToolsModule,
        SocketModule,
        HealthModule,
        SseModule,
        NetdiskModule,

        TodoModule,

        ChatModule,

        BaseModule,

        XwsbookModule,

    ],
    providers: [
        {provide: APP_FILTER, useClass: AllExceptionsFilter},

        {provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor},
        {provide: APP_INTERCEPTOR, useClass: TransformInterceptor},
        {provide: APP_INTERCEPTOR, useFactory: () => new TimeoutInterceptor(15 * 1000)},
        {provide: APP_INTERCEPTOR, useClass: IdempotenceInterceptor},

        {provide: APP_GUARD, useClass: JwtAuthGuard},
        {provide: APP_GUARD, useClass: RbacGuard},
        // 请求速率守卫
        {provide: APP_GUARD, useClass: ThrottlerGuard},

    ],
})

export class AppModule {
}

// export class AppModule implements NestModule{
//     configure(consumer: MiddlewareConsumer){
//         consumer.apply(LoggerMiddleware).forRoutes('*');
//     }
// }
