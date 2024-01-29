import dayjs from 'dayjs'
import { isDate } from 'lodash'

const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'
const DATE_FORMAT = 'YYYY-MM-DD'

export function formatToDateTime(
  date: string | number | Date | dayjs.Dayjs | null | undefined = undefined,
  format = DATE_TIME_FORMAT,
): string {
  return dayjs(date).format(format)
}

export function formatToDate(
  date: string | number | Date | dayjs.Dayjs | null | undefined = undefined,
  format = DATE_FORMAT,
): string {
  return dayjs(date).format(format)
}

export function isDateObject(obj: unknown): boolean {
  return isDate(obj) || dayjs.isDayjs(obj)
}
