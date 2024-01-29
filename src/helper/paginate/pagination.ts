import { ObjectLiteral } from 'typeorm'

import { IPaginationMeta } from './interface'

export class Pagination<
  PaginationObject,
  T extends ObjectLiteral = IPaginationMeta,
> {
  constructor(
    public readonly items: PaginationObject[],

    public readonly meta: T,
  ) {}
}
