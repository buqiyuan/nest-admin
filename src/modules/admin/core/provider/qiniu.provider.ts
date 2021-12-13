import { FactoryProvider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { QINIU_CONFIG } from 'src/modules/admin/admin.constants';
import { IQiniuConfig } from '../../admin.interface';

/**
 * 提供使用 @Inject(QINIU_CONFIG) 直接获取七牛配置
 */
export function qiniuProvider(): FactoryProvider {
  return {
    provide: QINIU_CONFIG,
    useFactory: (configService: ConfigService): IQiniuConfig => ({
      accessKey: configService.get('qiniu.accessKey'),
      secretKey: configService.get('qiniu.secretKey'),
      domain: configService.get('qiniu.domain'),
      bucket: configService.get('qiniu.bucket'),
      zone: configService.get('qiniu.zone'),
      access: configService.get('qiniu.access'),
    }),
    inject: [ConfigService],
  };
}
