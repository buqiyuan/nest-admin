import { applyDecorators } from '@nestjs/common'
import {
  IsBoolean,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator'
import { isNumber } from 'lodash'

import {
  ToArray,
  ToBoolean,
  ToDate,
  ToLowerCase,
  ToNumber,
  ToTrim,
  ToUpperCase,
} from './transform.decorator'

interface IOptionalOptions {
  required?: boolean
}

interface INumberFieldOptions extends IOptionalOptions {
  each?: boolean
  int?: boolean
  min?: number
  max?: number
  positive?: boolean
}

interface IStringFieldOptions extends IOptionalOptions {
  each?: boolean
  minLength?: number
  maxLength?: number
  lowerCase?: boolean
  upperCase?: boolean
}

export function NumberField(
  options: INumberFieldOptions = {},
): PropertyDecorator {
  const { each, min, max, int, positive, required = true } = options

  const decorators = [ToNumber()]

  if (each)
    decorators.push(ToArray())

  if (int)
    decorators.push(IsInt({ each }))
  else
    decorators.push(IsNumber({}, { each }))

  if (isNumber(min))
    decorators.push(Min(min, { each }))

  if (isNumber(max))
    decorators.push(Max(max, { each }))

  if (positive)
    decorators.push(IsPositive({ each }))

  if (!required)
    decorators.push(IsOptional())

  return applyDecorators(...decorators)
}

export function StringField(
  options: IStringFieldOptions = {},
): PropertyDecorator {
  const {
    each,
    minLength,
    maxLength,
    lowerCase,
    upperCase,
    required = true,
  } = options

  const decorators = [IsString({ each }), ToTrim()]

  if (each)
    decorators.push(ToArray())

  if (isNumber(minLength))
    decorators.push(MinLength(minLength, { each }))

  if (isNumber(maxLength))
    decorators.push(MaxLength(maxLength, { each }))

  if (lowerCase)
    decorators.push(ToLowerCase())

  if (upperCase)
    decorators.push(ToUpperCase())

  if (!required)
    decorators.push(IsOptional())
  else
    decorators.push(IsNotEmpty({ each }))

  return applyDecorators(...decorators)
}

export function BooleanField(
  options: IOptionalOptions = {},
): PropertyDecorator {
  const decorators = [ToBoolean(), IsBoolean()]

  const { required = true } = options

  if (!required)
    decorators.push(IsOptional())

  return applyDecorators(...decorators)
}

export function DateField(options: IOptionalOptions = {}): PropertyDecorator {
  const decorators = [ToDate(), IsDate()]

  const { required = true } = options

  if (!required)
    decorators.push(IsOptional())

  return applyDecorators(...decorators)
}
