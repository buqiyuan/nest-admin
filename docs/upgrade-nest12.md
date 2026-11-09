# NestJS 12 / platform-node / TypeORM 1 升级说明

升级基准是 `main` 的 `5b549e5`。版本号在 2026-11-09 对照 npm registry 和官方发布说明核对过，不是把示例版本直接写进 `package.json`。

## 指定版本是否存在

| 包 | 本次使用 | 核对结果 |
| --- | --- | --- |
| `@nestjs/common` / `@nestjs/core` | 12.4.0 | registry 上的 `latest`。`legacy` 仍是 11.2.8，`next` 是 12.0.0-alpha.7。没有比 12.4.0 更高的稳定版。 |
| `@nestjs/platform-node` | 12.4.0 | 从 12.3.0 起才有这个包，当前 `latest` 也是 12.4.0（2026-11-06）。说明是 “Run NestJS directly on node:http”。包本身是 ESM，peer 是 `@nestjs/common` / `@nestjs/core` ^12。 |
| `typeorm` | 1.1.2 | 2026-10-08 发布，当前 `latest`。`@nestjs/typeorm@12.0.3` 的 peer `^0.3.0 \|\| ^1.0.0-dev` 能匹配 1.1.2。 |

官方材料：

- Nest 11 → 12：<https://docs.nestjs.com/migration-guide>
- HTTP 适配器：<https://docs.nestjs.com/http/performance>
- TypeORM 0.3 → 1.0：<https://typeorm.io/docs/releases/1.0/upgrading-from-0.3>
- TypeORM 1.1.2：<https://github.com/typeorm/typeorm/releases/tag/1.1.2>

## 架构决定

应用保持 CommonJS（`tsconfig` 的 `module` 仍是 `commonjs`）。Nest 12 允许 CommonJS 应用通过 Node 20.19+ / 22.12+ / 24 的 `require(esm)` 使用 ESM 包，不要求把源码改成 `.js` 后缀。Node 选 **24.22.2 LTS**。`engines.node` 定为 `>=24.15.0`，同时满足：

- TypeORM 1.1 在 24 线上要求 `>=24.11`
- `@nestjs/schematics@12` 在 24 线上要求 `>=24.15`
- `@nestjs-labs/nestjs-ioredis@12` 要求 Node `>=24`

不使用 Node 21 / 23 / 25。

HTTP 层换成官方 `NodeAdapter`，删除 `@nestjs/platform-fastify` 和 `@fastify/cookie`、`@fastify/multipart`、`@fastify/static`。没有安装 `@nestjs/platform-express`。`@nestjs/core` 把它列为可选 peer。仓库里唯一的 `NestFactory.create` 在 `src/main.ts`，并且传入 `new NodeAdapter()`。现有单元测试不启动 HTTP，不会退回 Express，也没有覆盖适配器。适配器行为靠生产进程的冒烟和文末复核。

```ts
const app = await NestFactory.create<NestNodeApplication>(AppModule, nodeAdapter, {
  bodyParser: false,
  routeConflictPolicy: { duplicate: 'error', shadow: 'warn' },
})
app.useBodyParser('json', { limit: '1mb' })
app.useBodyParser('urlencoded', { limit: '1mb', extended: true })
```

`bodyParser: false` 是必须的。Nest 12 在 `init()` 里就会按默认 100kb 注册解析器，之后再 `useBodyParser` 只会再挂一个解析器，不会把限额抬高。旧 Fastify 适配器的 body 限额是 1mb，这里按这个值接上。

`routeConflictPolicy` 里重复路由直接失败，被静态路径挡住的参数路由只告警。Node 适配器按特异性匹配，并且 `caseSensitive: true`，和原来的 Fastify 一样。`GET /menus/permissions` 仍优先于 `GET /menus/:id`。大小写不同的路径不会命中。

缓存从 `cache-manager-ioredis-yet` 换成 cache-manager 7 + `@keyv/redis`。`CacheService` 不再读 `cache.store.client`，Socket.IO emitter、幂等和按前缀删 key 改走已经存在的 ioredis `REDIS_CLIENT`。Keyv store 注册了 `error` 监听，避免 Redis 断开时把进程打崩。`cleanCatch()` 仍按 `api-cache:*` 扫描 ioredis，当前没有调用方；HTTP 缓存的 key 在 Keyv 里，这个前缀清不到它们。

邮件改用 `@nestjs-modules/mailer@4` 的公开入口 `@nestjs-modules/mailer/adapters/handlebars.adapter`。没有挂 preview 模块，不会多出 `/_mailer`。

## 行为变化

- 请求路径、JSON 外壳 `{ code, message, data }`、全局前缀 `/api`、静态资源前缀 `/upload` 保持原样。
- `trustProxy: true` 保留。反向代理后面的 `X-Forwarded-*` 仍会影响 IP。这个头可以被伪造，和旧 Fastify 配置一样，不要在不受信任的入口前直接暴露。
- 查询字符串改由 `qs.parse` 在适配器里解析。`TransformInterceptor` 里事后改 `request.query` 的代码已删除。
- cookie 仍用 `cookie-parser`，默认 secret 与旧 Fastify cookie 相同，避免已签发的签名 cookie 全部失效。可通过 `COOKIE_SECRET` 覆盖。
- `.php` 仍返回 418，`favicon.ico` / `manifest.json` 仍返回 204。没有 Origin 时仍用 Host 补上。
- 上传字段名仍是 `file`，大小仍是 6MB。超过限额返回 HTTP 413。运行时仍然不按 MIME 白名单拒绝文件，和旧的 `IsFile` 只用于 Swagger 的行为一致。
- SSE 断开改听 `req.on('close')`。`?token=` 只在 `Accept: text/event-stream` 时补成 Bearer，普通接口不能靠查询参数带登录态。
- TypeORM 1 删除了字符串数组形式的 `relations` / `select`，`Repository.exist()` 改名为 `exists()`，`findByIds` 删除。调用点已改成对象形式或 `findBy({ id: In(...) })`。树仓库的 `findTrees` 仍接受 `relations: string[]`，部门树保持这个签名。
- `find` / `update` / `delete` 的 where 里出现 `null` 或 `undefined` 时，TypeORM 1 默认抛错。QueryBuilder 的 `.where()` 不受这条默认值影响。用户创建在 `deptId == null` 时不再 `findOneBy({ id: undefined })`。按不存在的用户名查存储时返回空分页，不再把条件丢掉然后列出全部文件。
- 本仓库的多对一没有写 `nullable: false`，不会因为 TypeORM 1 把这类关系改成 INNER JOIN 而丢行。
- **`synchronize` 在代码里固定为 `false`。** `DB_SYNCHRONIZE=true` 只会打警告，不会改表。TypeORM 1 的命名哈希变了，打开同步可能重命名索引和外键。结构只走已有 migration，这次没有新增 migration，也没有改历史 SQL。
- `DEMO_MODE` 仍只锁内置管理员（用户名 `admin` / 用户 id 1）的账号、密码、禁用和删除，返回 403 和「演示环境不允许修改管理员账号或密码」。`IS_DEMO` 仍会拒绝除 GET 和登录以外的写请求。两套开关没有合并。
- JWT 密钥校验没有放宽。缺失、过短或命中已知占位值时进程拒绝启动。
- POST 的 HTTP 状态仍是 Nest 默认的 201，响应体里的 `code` 仍是 200。权限不足仍是业务码（冒烟里是 `code=1102`，HTTP 200，文案「无权限访问」），不是新的 HTTP 403。这是原来的 `BusinessException` 用 `HttpStatus.OK` 的行为。
- Nest 12 给 `HttpException` 增加了字符串 `errorCode`。业务异常里的数字码改存到私有字段 `bizCode`，`getErrorCode()` 和响应体里的 `code` 不变。
- cache-manager 7 的 `get` 未命中返回 `undefined`。TTL 单位仍是毫秒，概览 `@CacheTTL(3600)` 和 serve `@CacheTTL(10000)` 的数字没有改成“一小时”。
- helmet 升到 8，但源码里没有启用它，响应头不会因此变化。
- 没有改成 Zod，没有改成 BullMQ，没有启用 GraphQL / NATS / `@nestjs/observe`。

## 没有升到“最新”的包

| 包 | 最新 | 实际 | 原因 |
| --- | --- | --- | --- |
| `typescript` | 7.0.2 | 6.0.3 | `@nestjs/swagger@12.1.1` 的 peer 是 `^5.5.0 \|\| ^6.0.0`，TypeScript 7 不满足。`ts-jest@29` 也要求 `<7`。 |
| `ioredis` | 6.0.0 | 5.11.1 | `@nestjs-labs/nestjs-ioredis@12` 的 peer 是 `ioredis@^5`，文档写明 Nest 12 + ioredis 5 用这个包。 |
| `@nestjs/throttler` | 6.7.1 | 6.7.1 | 没有 12.x。 |
| `msgpackr` | 2.1.4 | 1.12.1 | 只被任务队列单测用来确认 Bull 能打包的参数。Bull 4.16.5 依赖的就是 1.12.1。 |
| `webpack` | 5.105.x | 未直接安装 | `@nestjs/cli` 的 webpack builder 想要 `webpack@^5.105.4`，本项目 `nest-cli.json` 用的是 tsc。`pnpm peers check` 会提示这个 peer，安装和 `nest build` 都能通过。 |

`pluralize` 和测试里的 `msgpackr` 以前靠提升出来的间接依赖。pnpm 12 不再默认提升，已改成直接依赖。

## 主要版本对照

| 依赖 | 升级前 | 升级后 |
| --- | --- | --- |
| Nest 核心与 CLI | 11.0.x / CLI 11 | 12.4.0 / CLI 12.0.12 |
| HTTP | `@nestjs/platform-fastify` | `@nestjs/platform-node` 12.4.0 |
| TypeORM / `@nestjs/typeorm` | 0.3.22 / 11 | 1.1.2 / 12.0.3 |
| mysql2 | 3.x | 3.24.6 |
| cache-manager | 5 + ioredis-yet | 7.2.9 + `@keyv/redis` 6.1.0 |
| mailer | 2.x | 4.0.0 |
| TypeScript | 5.x | 6.0.3 |
| ESLint / antfu | 9 / 4 | 10.14.0 / 10.0.0 |
| Jest | 29 | 30.5.2 |
| pnpm / Node | 9 / >=20 | 12.18.0 / >=24.15 |

pnpm 12 不再读取 `package.json` 的 `pnpm` 字段。构建脚本白名单写在 `pnpm-workspace.yaml` 的 `allowBuilds`。`minimumReleaseAge` 设为 0，锁文件记录的是 registry 上的当前稳定版，而不是被默认发布延迟挡下的旧版。`@scarf/scarf` 的安装脚本没有批准。

## 本次验证

环境：Node v24.22.2，pnpm 12.18.0。MySQL 8.0.46 和 Redis 由本机进程监听 127.0.0.1，不用 systemd（`/usr/sbin/policy-rc.d` 返回 101，拒绝服务启动）。数据库是单独的 `nest_admin_upgrade` 和单独的账号，没有连接仓库 `.env` 里的 13307，也没有连接任何外部库。`synchronize` 保持关闭。测试用的 JWT 写在被 gitignore 的 env 文件里，不进提交。

| 命令 | 结果 |
| --- | --- |
| `pnpm install`（registry.npmjs.org，无 `legacy-peer-deps`，无 `--force`） | 成功。peer 只剩 CLI 的 webpack / ts-loader，见上表。 |
| `pnpm exec tsc --noEmit` | 通过。 |
| `pnpm build`（`nest build`，含 Swagger 插件） | 通过，产物在 `dist/main.js`。 |
| `pnpm exec eslint .` | 通过。 |
| `node --experimental-vm-modules ./node_modules/jest/bin/jest.js --runInBand` | 9 个套件、95 个测试通过。 |
| `pnpm migration:run` | `InitData1707996695540` 和 `UpdateTable2001717007831711` 都成功。初始化 SQL 的多语句依赖 `multipleStatements`。 |
| `NODE_ENV=production node dist/main` | 进程启动。日志有 `DB_SYNCHRONIZE is ignored`。`GET /api-docs` 返回 200。 |
| HTTP 冒烟 | 25/25。见下一节。 |
| `docker build --network=host -t nest-admin:nest12-upgrade .` | 成功，镜像 `dc6706e67054`。没有 `docker run`，没有 `compose up`。 |

Jest 30 要靠 `vm.SourceTextModule.prototype.hasAsyncGraph` 判断能不能同步加载 ESM。Node 24.22 只有在 `--experimental-vm-modules` 下才暴露这个 API，所以 `pnpm test` 带了这个开关。不用这个开关时，直接 `require('@nestjs/common')` 是成功的，失败的是 Jest 自己的加载器。

冒烟覆盖：`.php` 418、favicon 204、Swagger、验证码（从本机 Redis 读出答案）、管理员登录、资料、权限、菜单、用户分页（含 `roles` / `dept`）、角色列表、`/api/system/menus/permissions`、部门树、创建用户、修改昵称、`DEMO_MODE` 下修改管理员密码返回 403、创建并更新角色、创建权限菜单、不存在的上传者返回空存储分页、multipart 上传、静态文件可下载、无权限角色访问用户列表被拒绝（`code=1102`）、该用户自己的资料仍可读取、SSE、Socket.IO polling。`IS_DEMO=false`，所以创建用户和角色这些写操作没有被演示总开关挡住。

`nanoid@6` 在 Node 24 上可以用 `require('nanoid')` 加载，应用启动和上传都没有因此失败。

创建这个分支触发了仓库里已有的 `Build RC Image`。GitHub 文档写明 [`create`](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#create) 在新建分支或 tag 时运行。`.github/workflows/build-rc.yml` 写了 `on.create.tags: ['*']`，这次实际事件仍是分支创建，不是 tag。

运行是 [Build RC Image #42558129023](https://github.com/buqiyuan/nest-admin/actions/runs/42558129023)，对应提交 `810fe97`，结论 success。日志里 `pnpm install --frozen-lockfile` 和 `nest build` 都完成，然后把镜像推到 Docker Hub 的 `buqiyuan/nest-admin-server:rc`。公开 registry 上这个 tag 的 digest 现在是 `sha256:fff3c1ed308e5544f06dde9457639b0a673f0fa272a5c9c8e5225e4d13c50e2b`，和这次 job 的 digest 一致。`:stable` 仍是 `sha256:d6995bef8ae9d118e75ef8e57e72af6a5ebc47e9beb71fe53a4537980232b2c4`，没有被这次运行改掉。

构建只有一条警告：Dockerfile 第 67 行的 `ENTRYPOINT` 是 shell 形式，BuildKit 建议改成 JSON。镜像已经推出去了。这次没有改 Dockerfile，也没有再推一版把 `:rc` 盖回去。

`build-stable.yml` 只在推送 `main` 时构建 `:stable`，里面的远程部署步骤是注释掉的。`deploy.yml` 跟着 `Sync To Gitee`，同步只在推送 `main` 时发生。这两个都没有在这个分支上跑。PR 的 `statusCheckRollup` 仍然是空数组：这个工作流不是 pull request check，文档提交 `1b75910` 也没有新的 run。这次 success 只证明 GitHub 上的镜像构建和 `:rc` 推送成功，不是测试流水线通过。

## 复核

2026-11-09 同一天又对过一次 registry：`@nestjs/core`、`@nestjs/platform-node` 的 `latest` 仍是 12.4.0，`typeorm` 的 `latest` 仍是 1.1.2。本机安装的就是这三个版本。`typescript` 的 `latest` 仍是 7.0.2，`ioredis` 的 `latest` 仍是 6.0.0，上一节的阻塞没有变化。platform-node 包里的 README 只是 Nest 的通用说明，适配器约定以 `adapters/node-adapter.js` 和 <https://docs.nestjs.com/http/performance> 为准。

对照 12.4.0 的源码：`NestApplication.useBodyParser` 会自己插入 `rawBody` 布尔值，应用代码第二个参数仍是选项对象。`rawBody` 为 false 时适配器原样使用 `{ limit: '1mb' }`。现场请求确认了这一点：约 200KB 的 JSON 被解析（验证码错误，HTTP 200，不是 413）；约 1.2MB 返回 HTTP 413，文案 `request entity too large`。默认 100KB 限额没有留下来。

对着仍在运行的 `NODE_ENV=production node dist/main` 又打了这些请求。管理员 JWT 来自本机库，没有改线上数据。

| 检查 | 结果 |
| --- | --- |
| `GET /api/health/database` | HTTP 200，`database.status` 为 `up` |
| `GET /api/system/roles/1` | HTTP 200，`menuIds` 长度 67。对象形式的 `select` / `relations` 能读出菜单。 |
| `GET /api/system/serve/stat` 连续两次 | `X-Cache` 从 `MISS` 变为 `HIT`。Keyv 缓存和 `CacheInterceptor` 在 Node 适配器上生效。 |
| `GET /api/system/users?dept[id]=1` | HTTP 200，没有 500 |
| Socket.IO 命名空间 `/admin`，刚签发的 access token | 收到 `GATEWAY_CONNECT`，文案是「WebSocket 已连接」 |
| 同一命名空间，伪造 token | `AUTH_FAILED`（认证失败）之后断开 |
| `pnpm exec tsc --noEmit` 与 Jest `--runInBand` | 再次通过，9 个套件、95 个测试 |

省略 `status` 的用户更新会把 `status: undefined` 传给 `repository.update`。本轮用 MySQL 核对过：被改过昵称的用户 `status` 仍是 1，没有被写成 NULL。TypeORM 1 对 where 里的 `undefined` 抛错；这条 SET 路径在 1.1.2 上没有改列。没有因此改业务代码。

本机镜像 `dc6706e67054` 只完成构建，没有 `docker run`。入口会等待 `DB_HOST=mysql` 并跑 migration，所以没有启动容器。GitHub Actions 另一次构建已经把 `:rc` 推到 Docker Hub，见上一节。

Docker：镜像里的 `pnpm install --frozen-lockfile` 和 `nest build` 都完成了。第一次用 npmmirror 失败，CDN 对 `@nestjs/cache-manager/-/cache-manager-12.0.4.tgz` 返回 404，因此 `.npmrc` 改回 `https://registry.npmjs.org`。本机没有 systemd 管理的 Docker 服务，`policy-rc.d` 拒绝 `docker.service`。验证时是手动启动 `dockerd --iptables=false --bridge=none`，构建使用 `--network=host`。镜像没有运行，避免入口脚本去连 `DB_HOST=mysql` 或任何库。

## 部署、迁移、回滚

1. 运行时改为 Node 24.15 或更高的 24 LTS。不要用 21、23、25。
2. 用 pnpm 12 安装。不要加 `legacy-peer-deps` 或 `--force`。
3. 设置各自独立、至少 32 位的 `JWT_SECRET` 和 `REFRESH_TOKEN_SECRET`。轮换后旧令牌失效。
4. 执行已有 migration。不要打开 `DB_SYNCHRONIZE`。这次没有新的 migration，回滚应用时不需要 `migration:revert`，除非你在此之后又加了自己的 migration。
5. 重新构建镜像（基础镜像 `node:24.22-bookworm-slim`，pnpm 12.18.0）。确认镜像能构建后再替换正在运行的容器。
6. 回滚就是回到上一版镜像和上一版代码。不要为了回滚去跑 TypeORM sync，也不要手改已经上线的索引名。
7. 创建这个分支时，已有的 `Build RC Image` 已经把 `buqiyuan/nest-admin-server:rc` 换成 digest `sha256:fff3c1ed308e5544f06dde9457639b0a673f0fa272a5c9c8e5225e4d13c50e2b`。`:stable` 没有变，远程部署工作流也没有跑。如果公开环境正在拉 `:rc`，需要维护者自行把这个 tag 指回升级前的镜像。这次没有再推镜像。

公开演示继续使用 `DEMO_MODE=true`。需要连普通写操作一起禁掉时才设 `IS_DEMO=true`。
