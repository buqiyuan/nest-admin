import { DataSourceOptions } from 'typeorm';
import * as qiniu from 'qiniu';

export default {
  rootRoleId: 1,
  // nodemailer config
  mailer: {
    host: 'xxx',
    port: 80,
    auth: {
      user: 'xxx',
      pass: 'xxx',
    },
    secure: false, // or true using 443
  },
  // amap config
  amap: {
    key: 'xxx',
  },
  // jwt sign secret
  jwt: {
    secret: process.env.JWT_SECRET || '123456',
  },
  // typeorm config
  database: {
    type: 'mysql',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.MYSQL_PORT, 10),
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    synchronize: true,
    logging: false,
    timezone: '+08:00', // 东八区
  } as DataSourceOptions,
  redis: {
    host: process.env.REDIS_HOST, // default value
    port: parseInt(process.env.REDIS_PORT, 10), // default value
    password: process.env.REDIS_PASSWORD,
    db: process.env.REDIS_DB,
  },
  // qiniu config
  qiniu: {
    accessKey: 'xxx',
    secretKey: 'xxx',
    domain: 'xxx',
    bucket: 'xxx',
    zone: qiniu.zone.Zone_z0,
    access: 'public',
  },
  swagger: {
    title: 'nest-admin后台管理系统API文档',
    desc: `NestJs CRUD for RESTful API使用 nestjs + mysql + typeorm + redis + jwt + swagger 企业中后台管理系统项目RBAC权限管理(细粒度到按钮)、实现单点登录等。`,
  },
};
