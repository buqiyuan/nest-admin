import { FactoryProvider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ROOT_ROLE_ID } from 'src/modules/admin/admin.constants';
import { ConfigurationKeyPaths } from '@/config/configuration';

/**
 * 提供使用 @Inject(ROOT_ROLE_ID) 直接获取RootRoleId
 */
export function rootRoleIdProvider(): FactoryProvider {
  return {
    provide: ROOT_ROLE_ID,
    useFactory: (configService: ConfigService<ConfigurationKeyPaths>) => {
      return configService.get<number>('rootRoleId', 1);
    },
    inject: [ConfigService],
  };
}
