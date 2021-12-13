import { conf } from 'qiniu';

export interface IAdminUser {
  uid: number;
  pv: number;
}

export type QINIU_ACCESS_CONTROL = 'private' | 'public';

export interface IQiniuConfig {
  accessKey: string;
  secretKey: string;
  bucket: string;
  zone: conf.Zone;
  domain: string;
  access: QINIU_ACCESS_CONTROL;
}
