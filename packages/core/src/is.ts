import { default as isMyPromise } from 'is-promise'
import {
  isUndefined,
  isNull,
  isString,
  isPlainObject as isTempObject,
  isEmpty as isTempEmpty,
  isElement as isTempElement,
} from 'lodash-es'
import { getTypeOfValue } from './utils'

export {
  isString,
  isNumber,
  isArray,
  isBoolean,
  isDate,
  isRegExp,
  isUndefined,
  isNull,
  isFunction,
  isMap,
  isWeakMap,
  isWeakSet,
} from 'lodash-es'

export const isWindow = (val: unknown): val is Window =>
  typeof window !== 'undefined' && getTypeOfValue(val) === 'window'

export const isBrowser = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
)

export const isServer = typeof window === 'undefined'

export const isClient = !isServer

export const isEmpty = <T = unknown>(val: T): val is T => isTempEmpty(val)

export const isElement = (val: unknown): val is Element => isTempElement(val)

export const isUrl = (path: string): boolean => {
  const reg =
    // eslint-disable-next-line no-useless-escape
    /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/
  return reg.test(path)
}

export const isNullOrUnDef = (val: unknown): val is null | undefined =>
  isUndefined(val) || isNull(val)

export const isPromise = <T = any>(val: any): val is Promise<T> =>
  isMyPromise(val)

export const isPlainObject = (val: unknown): val is Recordable =>
  isTempObject(val)

export const isHexColor = (color: string) => {
  const reg = /^#([0-9a-fA-F]{3}|[0-9a-fA-f]{6})$/
  return reg.test(color)
}

export const isStringNumber = (val: string): boolean => {
  if (!isString(val)) {
    return false
  }
  return !Number.isNaN(Number(val))
}
