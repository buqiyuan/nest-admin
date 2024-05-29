import { ArgumentMetadata, ValidationPipe } from '@nestjs/common'
import { Allow } from 'class-validator'

import { REQUEST_ENTITY_ID } from '~/constants/request.constant'

export class GlobalValidationPipe extends ValidationPipe {
  async transform(value: any, metadata: ArgumentMetadata) {
    const { type, metatype } = metadata

    if (type === 'body' && value[REQUEST_ENTITY_ID]) {
      class ExtendMetatype extends metatype {
        static name = metatype.name

        @Allow()
        [REQUEST_ENTITY_ID]: number
      }
      const transformedValue = await super.transform(value, {
        ...metadata,
        metatype: ExtendMetatype,
      })
      // 删除临时添加的属性，避免对数据库操作产生影响
      Reflect.deleteProperty(transformedValue, REQUEST_ENTITY_ID)

      return transformedValue
    }

    // 调用父类的 transform 方法以保留原有功能
    return super.transform(value, metadata)
  }
}
