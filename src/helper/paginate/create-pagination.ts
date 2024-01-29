import { IPaginationMeta } from './interface'
import { Pagination } from './pagination'

export function createPaginationObject<T>({
  items,
  totalItems,
  currentPage,
  limit,
}: {
  items: T[]
  totalItems?: number
  currentPage: number
  limit: number
}): Pagination<T> {
  const totalPages
    = totalItems !== undefined ? Math.ceil(totalItems / limit) : undefined

  const meta: IPaginationMeta = {
    totalItems,
    itemCount: items.length,
    itemsPerPage: limit,
    totalPages,
    currentPage,
  }

  return new Pagination<T>(items, meta)
}
