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
    host: 'mysql', // your host addr
    port: 3306,
    username: 'root',
    password: 'root',
    database: 'nest-admin',
    synchronize: true,
    logging: false,
    timezone: '+08:00', // 东八区
  },
  redis: {
    host: 'redis', // default value
    port: 6379, // default value
    password: '',
    db: 0,
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
};
