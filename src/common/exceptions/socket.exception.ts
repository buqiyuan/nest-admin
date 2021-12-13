import { WsException } from '@nestjs/websockets';
import { ErrorCodeMap } from '../contants/error-code.contants';

export class SocketException extends WsException {
  private errorCode: number;

  constructor(errorCode: number) {
    super(ErrorCodeMap[errorCode]);
    this.errorCode = errorCode;
  }

  getErrorCode(): number {
    return this.errorCode;
  }
}
