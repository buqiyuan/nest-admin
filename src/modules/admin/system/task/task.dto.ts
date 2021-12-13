import * as parser from 'cron-parser';
import { isEmpty } from 'lodash';
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
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

// cron 表达式验证，bull lib下引用了cron-parser
@ValidatorConstraint({ name: 'isCronExpression', async: false })
export class IsCronExpression implements ValidatorConstraintInterface {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  validate(value: string, args: ValidationArguments) {
    try {
      if (isEmpty(value)) {
        throw new Error('cron expression is empty');
      }
      parser.parseExpression(value);
      return true;
    } catch (e) {
      return false;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  defaultMessage(_args: ValidationArguments) {
    // here you can provide default error message if validation failed
    return 'this cron expression ($value) invalid';
  }
}

export class CreateTaskDto {
  @ApiProperty({ description: '任务名称' })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @ApiProperty({ description: '调用的服务' })
  @IsString()
  @MinLength(1)
  service: string;

  @ApiProperty({ description: '任务类别：cron | interval' })
  @IsIn([0, 1])
  type: number;

  @ApiProperty({ description: '任务状态' })
  @IsIn([0, 1])
  status: number;

  @ApiPropertyOptional({ description: '开始时间', type: Date })
  @IsDateString()
  @ValidateIf((o) => !isEmpty(o.startTime))
  startTime: string;

  @ApiPropertyOptional({ description: '结束时间', type: Date })
  @IsDateString()
  @ValidateIf((o) => !isEmpty(o.endTime))
  endTime: string;

  @ApiPropertyOptional({ description: '限制执行次数，负数则无限制' })
  @IsInt()
  @IsOptional()
  readonly limit: number = -1;

  @ApiProperty({ description: 'cron表达式' })
  @Validate(IsCronExpression)
  @ValidateIf((o) => o.type === 0)
  cron: string;

  @ApiProperty({ description: '执行间隔，毫秒单位' })
  @IsInt()
  @Min(100)
  @ValidateIf((o) => o.type === 1)
  every: number;

  @ApiPropertyOptional({ description: '执行参数' })
  @IsString()
  @IsOptional()
  data: string;

  @ApiPropertyOptional({ description: '任务备注' })
  @IsOptional()
  @IsString()
  remark: string;
}

export class UpdateTaskDto extends CreateTaskDto {
  @ApiProperty({ description: '需要更新的任务ID' })
  @IsInt()
  @Min(0)
  id: number;
}

export class CheckIdTaskDto {
  @ApiProperty({ description: '任务ID' })
  @IsInt()
  @Min(0)
  @Type(() => Number)
  id: number;
}
