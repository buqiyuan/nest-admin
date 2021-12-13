import { defineConfig } from './defineConfig';

/**
 * 项目通用默认配置，但优先级最低
 */
export default defineConfig({
  rootRoleId: parseInt(process.env.ROOT_ROLE_ID || '1'),
});
