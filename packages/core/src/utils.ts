import deepmerge from 'deepmerge'

interface Console<T = string> {
  log: (str: T) => void
  warn: (str: T) => void
  error: (str: T) => void
  success: (str: T) => void
}

/***************************************************************************/

/**
 * 预定义四种console.log打印的颜色
 */
export const _console: Console<string> = {
  log(str) {
    console.log(
      `%c${str}`,
      'background:#303133;color:#fff;fontSize:14px;padding:3px 10px;'
    )
  },
  warn(str) {
    console.log(
      `%c${str}`,
      'background:#E6A23C;color:#fff;fontSize:14px;padding:3px 10px;'
    )
  },
  error(str) {
    console.log(
      `%c${str}`,
      'background:#FC0505;color:#fff;fontSize:14px;padding:3px 10px;'
    )
  },
  success(str) {
    console.log(
      `%c${str}`,
      'background:#67C23A;color:#fff;fontSize:14px;padding:3px 10px;'
    )
  },
}

/**
 * 通过类型谓词转换指定变量的类型
 * @param val 需要转换的变量
 */
// @ts-ignore
export function assertType<T>(val: unknown): val is T {
  return true
}

/**
 * 获取值的类型
 * @param value 任意值（经过toLowerCase处理）
 */
export function getTypeOfValue(value: unknown) {
  return Object.prototype.toString.call(value).slice(8, -1).toLocaleLowerCase()
}

/**
 * 返回指定对象属性的值
 * @param obj
 * @param key
 * @returns
 */
export function getPropValue<T, K extends keyof T>(obj: T, key: K) {
  return obj[key]
}

/**
 * 对传入的数字，展示小数点后面的指定位数
 * @param num 要处理的数字
 * @param fixed 小数点后面的位数
 * @returns
 */
export function toFixed(num: number, fixed = 2) {
  return (Math.round(num * 100) / 100).toFixed(fixed)
}

/**
 * 数组乱序
 * @param arr
 * @returns
 */
export function arrScrambling<T>(arr: T[]): T[] {
  for (let i = 0; i < arr.length; i++) {
    const randomIndex = Math.round(Math.random() * (arr.length - 1 - i)) + i
    ;[arr[i], arr[randomIndex]] = [arr[randomIndex], arr[i]]
  }
  return arr
}

/**
 * 生成指定长度的随机字符串
 * @param len 字符串长度
 */
export function genRandomString(len = 6) {
  return Math.random().toString(36).slice(-len)
}

/**
 * 字符串首字母大写
 * @param str
 * @returns
 */
export function fistLetterUpper(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Checks if two numbers are approximately equal to each other
 * @param v1
 * @param v2
 * @param epsilon
 * @returns
 */
export function approximatelyEqual(v1: number, v2: number, epsilon = 0.001) {
  return Math.abs(v1 - v2) < epsilon
}

/**
 * javascript version sleep
 * @param ms number
 * @returns
 */
export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 设置轮询
 * @param callback 轮询执行的回调函数
 * @param time  轮询的时间间隔
 * @param immediate 是否立刻执行 true: 是 | false: 否
 */
export class PollingAction {
  // 轮询间隔
  private time: number
  // 是否立即执行
  private immediate: boolean
  // 轮询执行的操作
  private callback: AnyFunction

  private timer!: ReturnType<typeof setTimeout> | null

  constructor(callback: AnyFunction, time = 1000, immediate = false) {
    this.time = time
    this.immediate = immediate
    this.callback = callback
  }

  start() {
    if (this.immediate) {
      this.callback()
    }
    this.timer = setInterval(() => {
      try {
        this.callback()
      } catch (error) {
        console.log(error)
        this.cancel()
      }
    }, this.time)
  }

  cancel() {
    this.timer && clearInterval(this.timer)
    this.timer = null
  }
}

/**
 * Add the object as a parameter to the URL
 * @param baseUrl url
 * @param obj
 * @returns {string}
 * @example
 * ```ts
 *  let obj = {a: '3', b: '4'}
 *  setObjToUrlParams('www.baidu.com', obj)
 *  ==>www.baidu.com?a=3&b=4
 * ```
 */
export function setObjToUrlParams(baseUrl: string, obj: any): string {
  let parameters = ''
  for (const key in obj) {
    parameters += key + '=' + encodeURIComponent(obj[key]) + '&'
  }
  parameters = parameters.replace(/&$/, '')
  return /\?$/.test(baseUrl)
    ? baseUrl + parameters
    : baseUrl.replace(/\/?$/, '?') + parameters
}

/**
 * 将一串数字转换成数字千分位的写法 '1,234'
 * @param n
 * @returns
 */
export function convertToThousands(num: number) {
  const [integer, point] = num.toString().split('.')
  let res = ''
  const reg = /(\d{3})(?=\d)/g
  let newStr = integer
    .split('')
    .reverse()
    .join('')
    .replace(reg, match => {
      return match + ','
    })
  newStr = newStr.split('').reverse().join('')
  point ? (res = newStr + '.' + point) : (res = newStr)
  return res
}

/**
 * 脱敏处理，将字符串中间指定区间字符替换成指定字符串
 * @param str
 * @param start default 3
 * @param end default 7
 * @param fill default *
 * @returns
 */
export function convertStrToAsterisk(
  str: string,
  start = 3,
  end = 7,
  fill = '*'
) {
  if (str.length < end) {
    throw new Error('字符串长度不能小于指定的区间')
  }
  return str.slice(0, start) + ''.padStart(end - start, fill) + str.slice(end)
}

/**
 * 将数字转化为汉字大写金额
 */
export function convertChineseMoney(n: number) {
  const fraction = ['角', '分']
  const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
  const unit = [
    ['元', '万', '亿'],
    ['', '拾', '佰', '仟'],
  ]
  n = Math.abs(n)
  let s = ''
  for (let i = 0; i < fraction.length; i++) {
    s += (
      digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]
    ).replace(/零./, '')
  }
  s = s || '整'
  n = Math.floor(n)
  for (let i = 0; i < unit[0].length && n > 0; i++) {
    let p = ''
    for (let j = 0; j < unit[1].length && n > 0; j++) {
      p = digit[n % 10] + unit[1][j] + p
      n = Math.floor(n / 10)
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s
  }
  return s
    .replace(/(零.)*零元/, '元')
    .replace(/(零.)+/g, '零')
    .replace(/^整$/, '零元整')
}

/**************************下面的代码是封装promise请求**************************/
// export const awaitWrap = (promise: Promise<Result<any>>) =>
//   promise
//     .then(res => ({ success: res, error: null }))
//     .catch(err => ({ success: null, error: err }))

/**
 * 返回经过封装的promise或者函数，可以被注入到vue.prototype上
 * @param {function} func:(...args:any[])=>any
 * @returns {function}
 */
// const willInject = (func: (...args: any[]) => any, successCodes?: number[]) => {
//   if (['promise', 'function'].indexOf(getTypeOfValue(func)) > -1) {
//     return async (...funcParams: any[]) => {
//       const promiseTmp = func(...funcParams)
//       if (getTypeOfValue(promiseTmp) === 'promise') {
//         if (!successCodes || successCodes.length === 0) {
//           successCodes = [200, 0]
//         } else {
//           successCodes = [...successCodes]
//         }
//         const { success, error } = await awaitWrap(promiseTmp)
//         if (!success) {
//           _console.error(
//             `Oh..., There is an error with the network request ${error}`
//           )
//           return { data: null }
//         } else {
//           const { code = 200, message = '' } = success
//           if (successCodes.indexOf(code) > -1) {
//             return success
//           } else {
//             _console.error(
//               `The network request returns a data error-->${code}-->${message}`
//             )
//           }
//         }
//       } else {
//         return func
//       }
//     }
//   } else {
//     _console.warn(
//       `An unsupported format is detected and will be skipped, expected 'promise,function'`
//     )
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     return async (...funcParams: any[]) => {
//       return func
//     }
//   }
// }

/**
 * 一次性合并任意多个对象
 * @param sources
 */
export function mergeAll(...sources: Recordable[]) {
  if (sources.length === 1) {
    return sources[0]
  } else {
    return sources.reduce((acc, cur) => {
      return deepmerge(acc, cur)
    })
  }
}
