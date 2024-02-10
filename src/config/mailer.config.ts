import { ConfigType, registerAs } from '@nestjs/config'

import { env, envNumber } from '~/global/env'

export const mailerRegToken = 'mailer'

export const MailerConfig = registerAs(mailerRegToken, () => ({
  host: env('SMTP_HOST'),
  port: envNumber('SMTP_PORT'),
  ignoreTLS: true,
  secure: true,
  auth: {
    user: env('SMTP_USER'),
    pass: env('SMTP_PASS'),
  },
}))

export type IMailerConfig = ConfigType<typeof MailerConfig>
