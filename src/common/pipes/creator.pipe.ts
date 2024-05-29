import {
  ArgumentMetadata,
  Inject,
  Injectable,
  PipeTransform,
} from '@nestjs/common'
import { REQUEST } from '@nestjs/core'

import { OperatorDto } from '../dto/operator.dto'

@Injectable()
export class CreatorPipe implements PipeTransform {
  constructor(@Inject(REQUEST) private readonly request: any) {}
  transform(value: OperatorDto, metadata: ArgumentMetadata) {
    const user = this.request.user as IAuthUser

    value.createBy = user.uid

    return value
  }
}
