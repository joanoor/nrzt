/**
 * Independent time operation tool to facilitate subsequent switch to dayjs
 */
import { default as dateUtil } from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh'

const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'
const DATE_FORMAT = 'YYYY-MM-DD'

export const formatToDateTime = (
  date?: dateUtil.ConfigType,
  format = DATE_TIME_FORMAT
): string => {
  return dateUtil(date).format(format)
}

export const formatToDate = (
  date?: dateUtil.ConfigType,
  format = DATE_FORMAT
): string => {
  return dateUtil(date).format(format)
}

export const timeAgo = (target: string) => {
  dayjs.extend(relativeTime)
  dayjs.locale('zh')
  return dayjs().to(dayjs(target))
}

export const isDisableBeforeDate = (date: Date) => {
  return (
    dayjs().unix() < dayjs(date).unix() ||
    dayjs(date).unix() < dayjs('2022-01-01').unix()
  )
}
export const isDisableAfterDate = (date: Date) => {
  return dayjs().unix() > dayjs(date).unix()
}

export const dayjs = dateUtil
