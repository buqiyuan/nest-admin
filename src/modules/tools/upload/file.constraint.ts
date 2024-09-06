import { FastifyMultipartBaseOptions, MultipartFile } from '@fastify/multipart'
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'
import { has, isArray } from 'lodash'

type FileLimit = Pick<
  FastifyMultipartBaseOptions['limits'],
  'fileSize' | 'files'
> & {
  mimetypes?: string[]
}
function checkFileAndLimit(file: MultipartFile, limits: FileLimit = {}) {
  if (!('mimetype' in file))
    return false
  if (limits.mimetypes && !limits.mimetypes.includes(file.mimetype))
    return false
  if (
    has(file, '_buf')
    && Buffer.byteLength((file as any)._buf) > limits.fileSize
  ) {
    return false
  }
  return true
}

@ValidatorConstraint({ name: 'isFile' })
export class FileConstraint implements ValidatorConstraintInterface {
  validate(value: MultipartFile, args: ValidationArguments) {
    const [limits = {}] = args.constraints
    const values = (args.object as any)[args.property]
    const filesLimit = (limits as FileLimit).files ?? 0
    if (filesLimit > 0 && isArray(values) && values.length > filesLimit)
      return false
    return checkFileAndLimit(value, limits)
  }

  defaultMessage(_args: ValidationArguments) {
    return `The file which to upload's conditions are not met`
  }
}

/**
 * 图片验证规则
 * @param limits 限制选项
 * @param validationOptions class-validator选项
 */
export function IsFile(
  limits?: FileLimit,
  validationOptions?: ValidationOptions,
) {
  return (object: Record<string, any>, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [limits],
      validator: FileConstraint,
    })
  }
}
