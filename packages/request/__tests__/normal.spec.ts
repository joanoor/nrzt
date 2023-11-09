import { createAxios } from '../index'
import { IAxios } from '../src/Axios'

describe('测试request模块基本方法', () => {
  let http: IAxios

  beforeEach(() => {
    http = createAxios()
  })
  describe('createAxios：返回IAxios实例', () => {
    test('不带参数返回IAxios实例', () => {
      const http = createAxios()
      expect(http instanceof IAxios).toEqual(true)
    })

    test('带参数返回IAxios实例', () => {
      const http = createAxios({
        timeout: 30000,
        requestOptions: {
          ignoreCancelToken: false,
        },
      })
      expect(http instanceof IAxios).toEqual(true)
    })
  })

  test('获取axios实例', () => {
    const mockGetAxiosInstance = jest.spyOn(http, 'getAxiosInstance')
    const instance = http.getAxiosInstance()
    expect(mockGetAxiosInstance).toBeCalled()
    expect(typeof mockGetAxiosInstance.mock.results[0].value).toEqual(
      typeof instance
    )
  })

  test('configAxios', () => {
    const mockConfigAxios = jest.spyOn(http, 'configAxios')
    http.configAxios({
      timeout: 80000,
    })
    expect(mockConfigAxios).toBeCalled()
  })

  test('setHeader', () => {
    const mockSetHeader = jest.spyOn(http, 'setHeader')
    http.setHeader({
      name: 'xixi',
    })
    expect(mockSetHeader).toBeCalled()
    expect(Reflect.has(http.getAxiosInstance().defaults.headers, 'name')).toBe(
      true
    )
  })
})
