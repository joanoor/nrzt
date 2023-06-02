import { isPlainObject, isString } from '@nrzt/core'

const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'

/**
 * 添加时间戳
 * @param join
 * @param restful
 */
export function addTimeStamp<T extends boolean>(
  join: boolean,
  restful?: T
): T extends true ? string : object

export function addTimeStamp(join: boolean, restful = false): string | object {
  if (!join) {
    return restful ? '' : {}
  }
  const now = new Date().getTime()
  if (restful) {
    return `?_t=${now}`
  }
  return { _t: now }
}

/**
 * @description: Format request parameter time
 */
export function formatRequestDate(params: Recordable) {
  if (Object.prototype.toString.call(params) !== '[object Object]') {
    return
  }

  for (const key in params) {
    const format = params[key]?.format ?? null
    if (format && typeof format === 'function') {
      params[key] = params[key].format(DATE_TIME_FORMAT)
    }
    if (isString(key)) {
      const value = params[key]
      if (value) {
        try {
          params[key] = isString(value) ? value.trim() : value
        } catch (error: any) {
          /* istanbul ignore next */
          throw new Error(error)
        }
      }
    }
    if (isPlainObject(params[key])) {
      formatRequestDate(params[key])
    }
  }
}
