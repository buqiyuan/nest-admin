import { Injectable } from '@nestjs/common'
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'
import { isNil, merge } from 'lodash'
import { ClsService } from 'nestjs-cls'
import { DataSource, Not, ObjectType } from 'typeorm'

interface Condition {
  entity: ObjectType<any>
  /** 如果没有指定字段则使用当前验证的属性作为查询依据 */
  field?: string
  /** 验证失败的错误信息 */
  message?: string
}

/**
 * 验证某个字段的唯一性
 */
@ValidatorConstraint({ name: 'entityItemUnique', async: true })
@Injectable()
export class UniqueConstraint implements ValidatorConstraintInterface {
  constructor(private dataSource: DataSource, private readonly cls: ClsService) {}

  async validate(value: any, args: ValidationArguments) {
    // 获取要验证的模型和字段
    const config: Omit<Condition, 'entity'> = {
      field: args.property,
    }

    const condition = ('entity' in args.constraints[0]
      ? merge(config, args.constraints[0])
      : {
          ...config,
          entity: args.constraints[0],
        }) as unknown as Required<Condition>

    if (!condition.entity)
      return false

    try {
      // 查询是否存在数据,如果已经存在则验证失败
      const repo = this.dataSource.getRepository(condition.entity)

      // 如果没有传自定义的错误信息，则尝试获取该字段的 comment 作为信息提示
      if (!condition.message) {
        const targetColumn = repo.metadata.columns.find(n => n.propertyName === condition.field)
        if (targetColumn?.comment) {
          args.constraints[0].message = `已存在相同的${targetColumn.comment}`
        }
      }

      let andWhere = {}
      const operateId = this.cls.get('operateId')
      // 如果是编辑操作，则排除自身
      if (Number.isInteger(operateId)) {
        andWhere = { id: Not(operateId) }
      }

      return isNil(
        await repo.findOne({
          where: { [condition.field]: value, ...andWhere },
        }),
      )
    }
    catch (err) {
      // 如果数据库操作异常则验证失败
      return false
    }
  }

  defaultMessage(args: ValidationArguments) {
    const { entity, field, message } = args.constraints[0] as Condition
    const queryProperty = field ?? args.property
    // if (!(args.object as any).getManager)
    //   return 'getManager function not been found!'

    if (!entity)
      return 'Model not been specified!'

    if (message) {
      return message
    }

    // return `${queryProperty} of ${entity.name} must been unique!`
    return `${queryProperty} of ${entity.name} must been unique!`
  }
}

/**
 * 数据唯一性验证
 * @param entity Entity类或验证条件对象
 * @param validationOptions
 */
function IsUnique(
  entity: ObjectType<any>,
  validationOptions?: ValidationOptions,
): (object: Record<string, any>, propertyName: string) => void

function IsUnique(
  condition: Condition,
  validationOptions?: ValidationOptions,
): (object: Record<string, any>, propertyName: string) => void

function IsUnique(
  params: ObjectType<any> | Condition,
  validationOptions?: ValidationOptions,
) {
  return (object: Record<string, any>, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [params],
      validator: UniqueConstraint,
    })
  }
}

export { IsUnique }
