import sys from './sys'

/**
 * 对网络请求返回状态进行处理
 * @param status
 * @param msg
 * @param errorMessageMode
 * @returns { String }
 */
export function checkStatus(status: number, msg?: string) {
  let errMessage = ''
  switch (status) {
    case 400:
      errMessage = msg || sys.api.errMsg400
      break
    case 401:
      errMessage = msg || sys.api.errMsg401
      break
    case 403:
      errMessage = msg || sys.api.errMsg403
      break
    case 404:
      errMessage = msg || sys.api.errMsg404
      break
    case 405:
      errMessage = msg || sys.api.errMsg405
      break
    case 408:
      errMessage = msg || sys.api.errMsg408
      break
    case 500:
      errMessage = msg || sys.api.errMsg500
      break
    case 501:
      errMessage = msg || sys.api.errMsg501
      break
    case 502:
      errMessage = msg || sys.api.errMsg502
      break
    case 503:
      errMessage = msg || sys.api.errMsg503
      break
    case 504:
      errMessage = msg || sys.api.errMsg504
      break
    case 505:
      errMessage = msg || sys.api.errMsg505
      break
    default:
      errMessage = msg || sys.api.errMsgUnknown
  }

  return errMessage
}
