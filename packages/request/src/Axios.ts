import qs from 'qs'
import axios from 'axios'
import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios'
import type { CreateAxiosOptions } from './axiosTransform'
import { AxiosCanceler } from './axiosCancel'
import { cloneDeep, isFunction } from 'lodash-es'
import { ContentTypeEnum, RequestEnum, RequestOptions, Result } from './types'
// import { UploadFileParams } from './types'

/**
 * 封装axios
 *
 * 参考：
 *
 * https://juejin.cn/post/6916682684169191437
 * https://segmentfault.com/a/1190000040457067
 *
 * 可以注册多个拦截器，对于request拦截器，使用unshift方法
 *
 * 对于response拦截器，使用的是push
 */
export class IAxios {
  private axiosInstance: AxiosInstance
  private readonly options: CreateAxiosOptions

  /**
   * 构造器生成axios实例
   * @param config
   */
  constructor(config: CreateAxiosOptions) {
    this.options = config
    this.axiosInstance = axios.create(config)

    // 建立拦截器
    this.setupInterceptors()
  }

  /**
   * 创建axios实例
   * @param config CreateAxiosOptions类型
   */
  private createAxios(config: CreateAxiosOptions) {
    this.axiosInstance = axios.create(config)
  }

  /**
   * 获取new IAxios实例时传入的参数中的transform属性值
   */
  private getTransform() {
    const { transform } = this.options
    return transform
  }

  /**
   * 获取axios实例
   */
  getAxiosInstance() {
    return this.axiosInstance
  }

  /**
   * 配置axios实例，若存在axios实例则什么也不做，否则生成axios实例
   * @param config
   */
  configAxios(config: CreateAxiosOptions) {
    if (!this.axiosInstance) return
    this.createAxios(config)
  }

  /**
   * 设置自定义实例默认headers
   * @param headers
   */
  setHeader(headers: any) {
    if (!this.axiosInstance) {
      /* istanbul ignore next */
      return
    } else {
      Object.assign(this.axiosInstance.defaults.headers, headers)
    }
  }

  /**
   * 设置统一拦截
   */
  private setupInterceptors() {
    const transform = this.getTransform()
    if (!transform) return
    // 统一拦截的方法放在了transform中
    const {
      requestInterceptors,
      requestInterceptorsCatch,
      responseInterceptors,
      responseInterceptorsCatch,
    } = transform

    const axiosCanceler = new AxiosCanceler()

    // request拦截器
    this.axiosInstance.interceptors.request.use(config => {
      const {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        headers: { ignoreCancelToken },
      } = config

      // cloneConfig只是用于判断ignoreCancel
      const cloneConfig: CreateAxiosOptions = cloneDeep(config)
      const ignoreCancel = ignoreCancelToken
        ? ignoreCancelToken
        : cloneConfig.requestOptions?.ignoreCancelToken

      // 当ignoreCancel不为真的时候，将请求添加进pendingMap中
      !ignoreCancel && axiosCanceler.addPending(config)

      if (requestInterceptors && isFunction(requestInterceptors)) {
        config = requestInterceptors(config, this.options)
      }
      return config
    }, undefined)

    // request拦截错误
    requestInterceptorsCatch &&
      isFunction(requestInterceptorsCatch) &&
      this.axiosInstance.interceptors.request.use(
        undefined,
        requestInterceptorsCatch
      )

    // response拦截器
    this.axiosInstance.interceptors.response.use((res: AxiosResponse<any>) => {
      res && axiosCanceler.removePending(res.config)
      if (responseInterceptors && isFunction(responseInterceptors)) {
        res = responseInterceptors(res)
      }
      return res
    }, undefined)

    // response拦截错误
    responseInterceptorsCatch &&
      isFunction(responseInterceptorsCatch) &&
      this.axiosInstance.interceptors.response.use(
        undefined,
        responseInterceptorsCatch
      )
  }

  /**
   * 通过判断是否以application/x-www-form-urlencoded来进行post请求，对config进行处理
   * @param config
   */
  supportFormData(config: AxiosRequestConfig) {
    const headers = config.headers || this.options.headers
    const contentType = headers?.['Content-Type'] || headers?.['content-type']

    // 当Content-Type不是application/x-www-form-urlencoded，或者请求体中没有data，或者求方法为get时，什么也不做，直接返回config
    if (
      contentType !== ContentTypeEnum.FORM_URLENCODED ||
      !Reflect.has(config, 'data') ||
      config.method?.toUpperCase() === RequestEnum.GET
    ) {
      return config
    }
    // 否则，对data进行qs序列化处理，转换成key1=value1&key2=value2这种样式
    return {
      ...config,
      data: qs.stringify(config.data, { arrayFormat: 'brackets' }),
    }
  }

  /**
   * 在项目表单中上传文件，可能有多种情况：
   * 1. 先上传文件，然后将接口返回的链接作为参数，提交表单时，一并提交；但这种情况没有考虑取消提交表单；
   * 2. 文件和表单的其他字段，比如：用户名，手机号码等等，在一起一并提交；这种方式可以取消表单，文件不会上传；
   *
   * 使用element UI上传组件
   * 上传文件的时候，必须使用multipart/form-data这种方式
   */
  // uploadFile<T = any>(config: AxiosRequestConfig, params: UploadFileParams) {
  //   const formData = new window.FormData()
  //   const customFilename = params.name || 'file'

  //   if (params.name || params.filename) {
  //     formData.append(customFilename, params.raw || params.file, params.name || params.filename)
  //   } else {
  //     formData.append(customFilename, params.raw || params.file)
  //   }

  //   if (params.data) {
  //     Object.keys(params.data).forEach(key => {
  //       const value = params.data?.[key]
  //       if (Array.isArray(value)) {
  //         value.forEach(item => {
  //           formData.append(`${key}[]`, item)
  //         })
  //         return
  //       }

  //       formData.append(key, params.data?.[key])
  //     })
  //   }

  //   return this.axiosInstance.request<T>({
  //     ...config,
  //     method: 'POST',
  //     data: formData,
  //     headers: {
  //       'Content-type': ContentTypeEnum.FORM_DATA,
  //       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //       // @ts-ignore
  //       ignoreCancelToken: true,
  //     },
  //   })
  // }

  /**
   * get请求
   * @param config
   * @param options
   * @returns
   */
  get<T = any>(
    config: AxiosRequestConfig,
    options?: RequestOptions
  ): Promise<T> {
    return this.request({ ...config, method: 'GET' }, options)
  }

  /**
   * post请求
   * @param config
   * @param options
   * @returns
   */
  post<T = any>(
    config: AxiosRequestConfig,
    options?: RequestOptions
  ): Promise<T> {
    return this.request({ ...config, method: 'POST' }, options)
  }

  /**
   * put请求
   * @param config
   * @param options
   * @returns
   */
  put<T = any>(
    config: AxiosRequestConfig,
    options?: RequestOptions
  ): Promise<T> {
    return this.request({ ...config, method: 'PUT' }, options)
  }

  /**
   * delete请求
   * @param config
   * @param options
   * @returns
   */
  delete<T = any>(
    config: AxiosRequestConfig,
    options?: RequestOptions
  ): Promise<T> {
    return this.request({ ...config, method: 'DELETE' }, options)
  }

  /**
   * @param config
   * @param options
   * @returns
   */
  request<T = any>(
    config: AxiosRequestConfig,
    options?: RequestOptions
  ): Promise<T> {
    let conf: CreateAxiosOptions = cloneDeep(config)
    const transform = this.getTransform()
    const { requestOptions } = this.options
    const opt: RequestOptions = Object.assign({}, requestOptions, options)
    const { beforeRequestHook, responseCatchHook, transformReponseHook } =
      transform || {}

    beforeRequestHook &&
      isFunction(beforeRequestHook) &&
      (conf = beforeRequestHook(conf, opt))
    conf.requestOptions = opt
    conf = this.supportFormData(conf)

    return new Promise((resolve, reject) => {
      this.axiosInstance
        .request<any, AxiosResponse<Result>>(conf)
        .then((res: AxiosResponse<Result>) => {
          if (transformReponseHook && isFunction(transformReponseHook)) {
            try {
              const ret = transformReponseHook(res, opt)
              resolve(ret)
            } catch (err) {
              /* istanbul ignore next */
              reject(err || new Error('请求出错，请稍候重试'))
            }
            return
          }
          /* istanbul ignore next */
          resolve(res as unknown as Promise<T>)
        })
        .catch((e: Error | AxiosError) => {
          if (responseCatchHook && isFunction(responseCatchHook)) {
            return reject(responseCatchHook(e, opt))
          }
          if (axios.isAxiosError(e)) {
            // rewrite error message from axios in here
          }
          reject(e)
        })
    })
  }
}
