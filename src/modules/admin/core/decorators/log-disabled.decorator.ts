import { SetMetadata } from '@nestjs/common';
import { LOG_DISABLED_KEY_METADATA } from '../../admin.constants';

/**
 * 日志记录禁用
 */
export const LogDisabled = () => SetMetadata(LOG_DISABLED_KEY_METADATA, true);
