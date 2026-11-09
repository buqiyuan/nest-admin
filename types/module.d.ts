import '@nestjs/platform-node'

declare module '@nestjs/platform-node' {
  interface NodeRequest {
    user?: IAuthUser
    accessToken?: string
    /** cookie-parser 挂上的普通 cookie */
    cookies?: Record<string, string | undefined>
    signedCookies?: Record<string, string | undefined>
  }
}

declare module 'nestjs-cls' {
  interface ClsStore {
    /** 当前请求操作的 ID */
    operateId: number
  }
}
