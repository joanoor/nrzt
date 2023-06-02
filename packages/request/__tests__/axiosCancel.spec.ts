import { AxiosCanceler } from '../src/axiosCancel'
import { pendingMap } from '../src/axiosCancel'

jest.mock('../axiosCancel', () => {
  const originalModule = jest.requireActual('../axiosCancel')
  return {
    __esModule: true,
    ...originalModule,
  }
})

describe('测试AxiosCanceler模块', () => {
  let axiosCanceler: AxiosCanceler
  beforeEach(() => {
    axiosCanceler = new AxiosCanceler()
  })

  test('测试添加pending', () => {
    axiosCanceler.addPending({
      url: '/first',
      method: 'GET',
    })
    expect(pendingMap.has('GET&/first')).toBe(true)
  })

  test('测试清空pendingMap', () => {
    axiosCanceler.addPending({
      url: '/first',
      method: 'GET',
    })
    expect(pendingMap.has('GET&/first')).toBe(true)

    axiosCanceler.removeAllPending()
    expect(pendingMap.has('GET&/first')).not.toBe(true)
    expect(Object.keys(pendingMap)).toEqual([])
  })

  test('删除指定的pending', () => {
    axiosCanceler.addPending({
      url: '/first',
      method: 'GET',
    })
    axiosCanceler.addPending({
      url: '/second',
      method: 'GET',
    })
    expect(pendingMap.has('GET&/first')).toBe(true)
    expect(pendingMap.has('GET&/second')).toBe(true)

    axiosCanceler.removePending({
      url: '/second',
      method: 'GET',
    })
    expect(pendingMap.has('GET&/second')).not.toBe(true)
    expect(pendingMap.has('GET&/first')).toBe(true)
  })

  test('重置pendingMap', () => {
    const mockReset = jest.spyOn(axiosCanceler, 'reset')
    axiosCanceler.reset()
    expect(Object.keys(pendingMap)).toEqual([])
    expect(mockReset).toBeCalled()
  })
})
