import { DataSourceOptions } from 'typeorm';
import * as qiniu from 'qiniu';

const parseZone = (zone: string) => {
  switch (zone) {
    case 'Zone_as0':
      return qiniu.zone.Zone_as0;
    case 'Zone_na0':
      return qiniu.zone.Zone_na0;
    case 'Zone_z0':
      return qiniu.zone.Zone_z0;
    case 'Zone_z1':
      return qiniu.zone.Zone_z1;
    case 'Zone_z2':
      return qiniu.zone.Zone_z2;
  }
};

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
    host: process.env.MYSQL_HOST,
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
    accessKey: process.env.QINIU_ACCESSKEY,
    secretKey: process.env.QINIU_SECRETKEY,
    domain: process.env.QINIU_DOMAIN,
    bucket: process.env.QINIU_BUCKET,
    zone: parseZone(process.env.QINIU_ZONE || 'Zone_z2'),
    access: (process.env.QINIU_ACCESS_TYPE as any) || 'public',
  },
  // swagger
  swagger: {
    enable: process.env.SWAGGER_ENABLE === 'true',
    path: process.env.SWAGGER_PATH,
    title: process.env.SWAGGER_TITLE,
    desc: process.env.SWAGGER_DESC,
    version: process.env.SWAGGER_VERSION,
  },
};
