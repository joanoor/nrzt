import type { AxiosTransform, CreateAxiosOptions } from './src/axiosTransform'
import { setObjToUrlParams, isString, deepmerge, isNumber } from '@nrzt/core'
import { formatRequestDate, addTimeStamp } from './src/helper'
import { RequestEnum, ContentTypeEnum } from './src/types'
import { IAxios } from './src/Axios'

// transform的默认值
const defaultTransform: AxiosTransform = {
  transformReponseHook(nativeResponse, options) {
    const { isTransformResponse, isReturnNativeResponse } = options
    // 返回原生响应头
    if (isReturnNativeResponse) return nativeResponse

    // 对数据不进行任何处理，直接返回
    if (!isTransformResponse) return nativeResponse.data
  },

  beforeRequestHook(config, options) {
    const {
      apiUrl,
      joinPrefix,
      joinParamsToUrl,
      formatDate,
      joinTimestamp = true,
      urlPrefix,
      timeout
    } = options
    if (joinPrefix) {
      config.url = `${urlPrefix}${config.url}`
    }

    if (isNumber(timeout)) {
      config.timeout = timeout
    }

    /* istanbul ignore if */
    if (apiUrl && isString(apiUrl)) {
      config.url = `${apiUrl}${config.url}`
    }

    const params = config.params || {}
    const data = config.data || false
    formatDate && data && !isString(data) && formatRequestDate(data)

    if (config.method?.toUpperCase() === RequestEnum.GET) {
      /* istanbul ignore next */
      if (!isString(params)) {
        // 给 get 请求加上时间戳参数，避免从缓存中拿数据。
        config.params = Object.assign(params || {}, addTimeStamp(joinTimestamp))
      } else {
        // 兼容restful风格
        config.url =
          config.url + params + `${addTimeStamp(joinTimestamp, true)}`
        config.params = undefined
      }
    }
    else {
      /* istanbul ignore else */
      if (!isString(params)) {
        /* istanbul ignore if */
        if (joinParamsToUrl) {
          config.url = setObjToUrlParams(
            config.url as string,
            Object.assign({}, config.params, config.data)
          )
        }
      } else {
        // 兼容restful风格
        config.url = config.url + params
        config.params = undefined
      }
    }
    return config
  },

  /**
   * 默认的response拦截器
   */
  responseInterceptors: response => {
    return response
  },
}

/**
 * 工厂函数，创建axios实例
 * @param opt
 * @example
 * const axiosInstance = creaeAxios(opt)
 */
export const createAxios = (opt?: Partial<CreateAxiosOptions>) => {
  return new IAxios(
    deepmerge(
      {
        // See https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#authentication_schemes
        // authentication schemes，e.g: Bearer
        // authenticationScheme: 'Bearer',
        authenticationScheme: '',
        timeout: 6000,
        // 基础接口地址
        // baseURL: globSetting.apiUrl,
        headers: { 'Content-Type': ContentTypeEnum.JSON },
        // 如果是form-data格式
        // headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
        // 数据处理方式
        transform: defaultTransform,
        // 配置项，下面的选项都可以在独立的接口请求中覆盖
        requestOptions: {
          joinPrefix: false,
          urlPrefix: '/prefix',
          isReturnNativeResponse: false,
          isTransformResponse: false,
          joinParamsToUrl: false,
          formatDate: true,
          errorMessageMode: 'message',
          joinTimestamp: true,
          ignoreCancelToken: true,
          withToken: true,
        },
      },
      opt || {}
    ) as CreateAxiosOptions
  )
}

export * from './src/axiosTransform'
export * from './src/checkStatus'
export * from './src/helper'
export * from './src/types'
export { AxiosCanceler } from './src/axiosCancel'
export { AxiosRetry } from './src/axiosRetry'
