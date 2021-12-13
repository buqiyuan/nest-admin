import { SetMetadata } from '@nestjs/common';
import { AUTHORIZE_KEY_METADATA } from '../../admin.constants';

/**
 * 开放授权Api，使用该注解则无需校验Token及权限
 */
export const Authorize = () => SetMetadata(AUTHORIZE_KEY_METADATA, true);
