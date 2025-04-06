import { BadRequestException } from '@nestjs/common'
import { ApiProperty, ApiPropertyOptional, IntersectionType, PartialType } from '@nestjs/swagger'
import {
  IsDateString,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
  Validate,
  ValidateIf,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'
import { CronExpressionParser } from 'cron-parser';
import { isEmpty } from 'lodash'

import { PagerDto } from '~/common/dto/pager.dto'
import { IsUnique } from '~/shared/database/constraints/unique.constraint'

import { TaskEntity } from './task.entity'

// cron 表达式验证，bull lib下引用了cron-parser
@ValidatorConstraint({ name: 'isCronExpression', async: false })
export class IsCronExpression implements ValidatorConstraintInterface {
  validate(value: string, _args: ValidationArguments) {
    try {
      if (isEmpty(value))
        throw new BadRequestException('cron expression is empty')

      CronExpressionParser.parse(value)
      return true
    }
    catch (e) {
      return false
    }
  }

  defaultMessage(_args: ValidationArguments) {
    return 'this cron expression ($value) invalid'
  }
}

export class TaskDto {
  @ApiProperty({ description: '任务名称' })
  @IsUnique({ entity: TaskEntity, message: '任务名称已存在' })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string

  @ApiProperty({ description: '调用的服务' })
  @IsString()
  @MinLength(1)
  service: string

  @ApiProperty({ description: '任务类别：cron | interval' })
  @IsIn([0, 1])
  type: number

  @ApiProperty({ description: '任务状态' })
  @IsIn([0, 1])
  status: number

  @ApiPropertyOptional({ description: '开始时间', type: Date })
  @IsDateString()
  @ValidateIf(o => !isEmpty(o.startTime))
  startTime: string

  @ApiPropertyOptional({ description: '结束时间', type: Date })
  @IsDateString()
  @ValidateIf(o => !isEmpty(o.endTime))
  endTime: string

  @ApiPropertyOptional({
    description: '限制执行次数，负数则无限制',
  })
  @IsOptional()
  @IsInt()
  limit?: number = -1

  @ApiProperty({ description: 'cron表达式' })
  @Validate(IsCronExpression)
  @ValidateIf(o => o.type === 0)
  cron: string

  @ApiProperty({ description: '执行间隔，毫秒单位' })
  @IsInt()
  @Min(100)
  @ValidateIf(o => o.type === 1)
  every?: number

  @ApiPropertyOptional({ description: '执行参数' })
  @IsOptional()
  @IsString()
  data?: string

  @ApiPropertyOptional({ description: '任务备注' })
  @IsOptional()
  @IsString()
  remark?: string
}

export class TaskUpdateDto extends PartialType(TaskDto) {}

export class TaskQueryDto extends IntersectionType(PagerDto, PartialType(TaskDto)) {}
