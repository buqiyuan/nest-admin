import { ConfigType, registerAs } from '@nestjs/config'
import * as qiniu from 'qiniu'

import { env } from '~/global/env'

function parseZone(zone: string) {
  switch (zone) {
    case 'Zone_as0':
      return qiniu.zone.Zone_as0
    case 'Zone_na0':
      return qiniu.zone.Zone_na0
    case 'Zone_z0':
      return qiniu.zone.Zone_z0
    case 'Zone_z1':
      return qiniu.zone.Zone_z1
    case 'Zone_z2':
      return qiniu.zone.Zone_z2
  }
}

export const ossRegToken = 'oss'

export const OssConfig = registerAs(ossRegToken, () => ({
  accessKey: env('OSS_ACCESSKEY'),
  secretKey: env('OSS_SECRETKEY'),
  domain: env('OSS_DOMAIN'),
  bucket: env('OSS_BUCKET'),
  zone: parseZone(env('OSS_ZONE') || 'Zone_z2'),
  access: (env('OSS_ACCESS_TYPE') as any) || 'public',
}))

export type IOssConfig = ConfigType<typeof OssConfig>
