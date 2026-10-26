# 遇到网络问题可以配置镜像加速：https://gist.github.com/y0ngb1n/7e8f16af3242c7815e7ca2f0833d3ea6
# FROM 表示设置要制作的镜像基于哪个镜像，FROM指令必须是整个Dockerfile的第一个指令，如果指定的镜像不存在默认会自动从Docker Hub上下载。
# 指定我们的基础镜像是node，latest表示版本是最新, 如果要求空间极致，可以选择lts-alpine
# 使用 as 来为某一阶段命名
FROM node:20-slim AS base

# 直接 `docker build -t web-api .` 时不要求额外 build-arg。
# docker compose 仍可通过 --build-arg PROJECT_DIR 覆盖。
ARG PROJECT_DIR=/nest-admin

# PATH 必须单独一条 ENV。写在同一条里时 $PNPM_HOME 还没生效，结果会变成空前缀。
ENV DB_HOST=mysql \
    APP_PORT=7001 \
    PROJECT_DIR=${PROJECT_DIR} \
    PNPM_HOME="/pnpm" \
    COREPACK_ENABLE_DOWNLOAD_PROMPT=0
ENV PATH="${PNPM_HOME}:${PATH}"

# package.json 的 packageManager 为 pnpm@9.1.0。预先激活，避免非交互构建时 corepack 等待确认。
RUN corepack enable \
    && corepack prepare pnpm@9.1.0 --activate \
    && yarn global add pm2

# WORKDIR指令用于设置Dockerfile中的RUN、CMD和ENTRYPOINT指令执行命令的工作目录(默认为/目录)，该指令在Dockerfile文件中可以出现多次，
# 如果使用相对路径则为相对于WORKDIR上一次的值，
# 例如WORKDIR /data，WORKDIR logs，RUN pwd最终输出的当前目录是/data/logs。
# cd 到 /nest-admin
WORKDIR $PROJECT_DIR
COPY ./ $PROJECT_DIR
RUN chmod +x ./wait-for-it.sh 

# set timezone
RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
    && echo 'Asia/Shanghai' > /etc/timezone

# 不使用 RUN --mount 缓存。Ubuntu 自带的 docker.io 往往没有 buildx，
# 默认 `docker build` 走 legacy builder，遇到 --mount 会直接失败。
# 见 https://pnpm.io/docker
FROM base AS prod-deps
RUN pnpm install --prod --frozen-lockfile

FROM base AS build
RUN pnpm install --frozen-lockfile
RUN pnpm run build


# mirror acceleration
# RUN npm config set registry https://registry.npmmirror.com
# RUN pnpm config set registry https://registry.npmmirror.com
# RUN npm config rm proxy && npm config rm https-proxy

FROM base
COPY --from=prod-deps $PROJECT_DIR/node_modules $PROJECT_DIR/node_modules
COPY --from=build $PROJECT_DIR/dist $PROJECT_DIR/dist

# EXPOSE port
EXPOSE $APP_PORT

# 容器启动时执行的命令，类似npm run start
# CMD ["pnpm", "start:prod"]
# CMD ["pm2-runtime", "ecosystem.config.js"]
# 生产镜像不含 devDependency cross-env，不能走 `pnpm migration:run`。
# npm_lifecycle_event=typeorm 让 database.config 打开 multipleStatements，初始化 SQL 才能一次执行。
ENTRYPOINT ./wait-for-it.sh $DB_HOST:${DB_PORT:-3306} -- sh -c "npm_lifecycle_event=typeorm ./node_modules/.bin/typeorm -d ./dist/config/database.config.js migration:run" && pm2-runtime ecosystem.config.js
