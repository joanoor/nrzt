/**
 * 对请求的数据进行处理
 */
import {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'
import { RequestOptions, Result } from './types'

export interface CreateAxiosOptions extends AxiosRequestConfig {
  authenticationScheme?: string
  transform?: AxiosTransform
  requestOptions?: RequestOptions
}

/**
 * 定义一个转换数据抽象类
 */
export abstract class AxiosTransform {
  /**
   * 发生在统一拦截之前，在请求接口前执行的钩子
   */
  beforeRequestHook?: (
    config: AxiosRequestConfig,
    options: RequestOptions
  ) => AxiosRequestConfig

  /**
   * 当请求接口成功时处理响应数据的钩子
   */
  transformReponseHook?: <T = Result>(
    res: AxiosResponse<T>,
    options: RequestOptions
  ) => any

  /**
   * 当网络请求请求，接口失败时处理失败的钩子
   */
  responseCatchHook?: (e: Error, options: RequestOptions) => Promise<any>

  /**
   * request统一拦截器
   */
  requestInterceptors?: (
    config: InternalAxiosRequestConfig,
    options: CreateAxiosOptions
  ) => InternalAxiosRequestConfig

  /**
   * response统一拦截器
   * 当http网络请求正常，接口正常返回数据（不论接口返回的状态码是不是正常的成功码）时，执行此方法。
   */
  responseInterceptors?: (res: AxiosResponse) => AxiosResponse

  /**
   * request统一拦截器错误处理
   */
  requestInterceptorsCatch?: (error: Error) => void

  /**
   * response统一拦截器错误处理
   */
  responseInterceptorsCatch?: (error: AxiosError<any>) => void

  /***********************************************************************/
}
