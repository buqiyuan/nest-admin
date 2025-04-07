import { ConfigType, registerAs } from '@nestjs/config'

import { env, envBoolean } from '~/global/env'

export const swaggerRegToken = 'swagger'

export const SwaggerConfig = registerAs(swaggerRegToken, () => ({
  enable: envBoolean('SWAGGER_ENABLE'),
  path: env('SWAGGER_PATH'),
  serverUrl: env('SWAGGER_SERVER_URL', env('APP_BASE_URL')),
}))

export type ISwaggerConfig = ConfigType<typeof SwaggerConfig>
