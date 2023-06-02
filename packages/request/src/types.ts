export interface UploadFileParams {
  // Other parameters
  data?: Recordable
  // File parameter interface field name
  name?: string
  // file name
  file: File | Blob
  raw?: File | Blob
  // file name
  filename?: string
  [key: string]: any
}

export type ErrorMessageMode = 'none' | 'modal' | 'message' | undefined

// post请求的时候添加参数到url
export interface RequestOptions {
  joinParamsToUrl?: boolean
  formatDate?: boolean // 格式化提交参数时间
  isTransformResponse?: boolean // 需要对返回数据进行处理
  isReturnNativeResponse?: boolean // 是否返回原生响应头。比如：需要获取响应头时使用该属性
  joinPrefix?: boolean // 默认将prefix添加到url
  apiUrl?: string // 接口地址
  urlPrefix?: string // 请求拼接路径
  errorMessageMode?: ErrorMessageMode // 消息提示类型
  joinTimestamp?: boolean // 是否加入时间戳
  ignoreCancelToken?: boolean // 忽略cancelToken
  withToken?: boolean // 是否携带token
  showSuccessModal?: boolean
}

export interface Result<T = any> {
  code: number
  type?: 'success' | 'error' | 'warning'
  message: string
  data: T
}

export enum RequestEnum {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export enum ResultEnum {
  SUCCESS = 200,
  ERROR = 1,
  TIMEOUT = 401,
  TYPE = 'success',
}

export enum ContentTypeEnum {
  // json
  JSON = 'application/json;charset=UTF-8',
  // 下面这两种都是formData的形式
  // form-data qs
  FORM_URLENCODED = 'application/x-www-form-urlencoded;charset=UTF-8',
  // form-data  upload
  FORM_DATA = 'multipart/form-data',
}
