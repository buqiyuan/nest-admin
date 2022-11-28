## nest-admin

![](https://img.shields.io/github/commit-activity/m/buqiyuan/nest-admin) ![](https://img.shields.io/github/license/buqiyuan/nest-admin) ![](https://img.shields.io/github/repo-size/buqiyuan/nest-admin) ![](https://img.shields.io/github/languages/top/buqiyuan/nest-admin)

**基于 NestJs + TypeScript + TypeORM + Redis + MySql + Vue3 + Ant Design Vue 编写的一款简单高效的前后端分离的权限管理系统。希望这个项目在全栈的路上能够帮助到你。**

- 前端项目地址：[传送门](https://github.com/buqiyuan/vue3-antd-admin)

### 演示地址

- [http://buqiyuan.gitee.io/vue3-antd-admin/](http://buqiyuan.gitee.io/vue3-antd-admin/)
- [Swagger Api 文档](https://nest-api.buqiyuan.site/swagger-api)

### 项目启动前的准备工作

- sql 文件：[/deploy/sql/init.sql](https://github.com/buqiyuan/nest-admin/tree/main/deploy/sql) 用于数据库初始化
- 项目相关配置，如：配置 mysql 和 redis 连接
  - 公共配置: [.env](https://github.com/buqiyuan/nest-admin/blob/main/.env)
  - 开发环境: [.env.development](https://github.com/buqiyuan/nest-admin/blob/main/.env.development)
  - 生产环境: [.env.production](https://github.com/buqiyuan/nest-admin/blob/main/.env.production)

演示环境账号密码：

|   账号    |  密码  |    权限    |
| :-------: | :----: | :--------: |
| rootadmin | 123456 | 超级管理员 |

> 所有新建的用户初始密码都为 123456

本地部署账号密码：

|   账号    |  密码  |    权限    |
| :-------: | :----: | :--------: |
| rootadmin | 123456 | 超级管理员 |

## 快速体验

启动成功后，通过 http://localhost:7001/swagger-api/ 访问。

```bash
yarn docker:up
# or
docker compose --env-file .env.production up -d --no-build
```

停止并删除所有容器

```bash
yarn docker:down
# or
docker compose --env-file .env.production down
```

查看实时日志输出

```bash
yarn docker:logs
# or
docker compose --env-file .env.production logs -f

```

## 本地开发

- 获取项目代码

```bash
git clone https://github.com/buqiyuan/nest-admin
```

- 【可选】如果你是新手，还不太会搭建`mysql/redis`，你可以使用 `Docker` 启动指定服务供本地开发时使用, 例如：

```bash
# 启动MySql服务
docker compose  --env-file .env.development run -d --service-ports mysql
# 启动Redis服务
docker compose  --env-file .env.development run -d --service-ports redis
```

- 安装依赖

```bash
cd nest-admin

yarn install

```

- 运行
  启动成功后，通过 http://localhost:7001/swagger-api/ 访问。

```bash
yarn dev
```

- 打包

```bash
yarn build
```

### 系统截图

![](https://s1.ax1x.com/2021/12/11/oTi1nf.png)

![](https://s1.ax1x.com/2021/12/11/oTithj.png)

![](https://s1.ax1x.com/2021/12/11/oTirHU.png)

![](https://s1.ax1x.com/2021/12/11/oTia3n.png)

### 欢迎 Star && PR

**如果项目有帮助到你可以点个 Star 支持下。有更好的实现欢迎 PR。**

### 致谢

- [sf-nest-admin](https://github.com/hackycy/sf-nest-admin)

### LICENSE

[MIT](LICENSE)
