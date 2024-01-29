import { ConfigType, registerAs } from '@nestjs/config'

import { env, envBoolean } from '~/global/env'

export const SwaggerConfig = registerAs('swagger', () => ({
  enable: envBoolean('SWAGGER_ENABLE'),
  path: env('SWAGGER_PATH'),
}))

export type ISwaggerConfig = ConfigType<typeof SwaggerConfig>
