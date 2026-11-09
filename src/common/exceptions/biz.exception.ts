import { HttpException, HttpStatus } from '@nestjs/common'

import { ErrorEnum } from '~/constants/error-code.constant'
import { RESPONSE_SUCCESS_CODE } from '~/constants/response.constant'

export class BusinessException extends HttpException {
  // Nest 12 的 HttpException.errorCode 是字符串，和这里的业务数字码不是同一个字段。
  private bizCode: number

  constructor(error: ErrorEnum | string) {
    // 如果是非 ErrorEnum
    if (!error.includes(':')) {
      super(
        HttpException.createBody({
          code: RESPONSE_SUCCESS_CODE,
          message: error,
        }),
        HttpStatus.OK,
      )
      this.bizCode = RESPONSE_SUCCESS_CODE
      return
    }

    const [code, message] = error.split(':')
    super(
      HttpException.createBody({
        code,
        message,
      }),
      HttpStatus.OK,
    )

    this.bizCode = Number(code)
  }

  getErrorCode(): number {
    return this.bizCode
  }
}

export { BusinessException as BizException }
