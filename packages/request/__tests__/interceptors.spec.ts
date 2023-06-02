import { createAxios, checkStatus } from '../index'
import sys from '../src/sys'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { IAxios } from '../src/Axios'

describe('测试统一拦截器', () => {
  let mock: MockAdapter
  let http: IAxios
  beforeEach(() => {
    mock = new MockAdapter(axios)

    http = createAxios({
      transform: {
        // 当响应出错的时候，是status状态
        responseInterceptorsCatch(error: any) {
          const { response } = error || {}
          const msg: string = response?.data?.error?.message ?? ''
          const errMessage = checkStatus(error?.response?.status, msg)
          return Promise.reject(Object.assign(error, { message: errMessage }))
        },
      },
    })
  })
  test('接口报错400', () => {
    mock.onAny('/400').reply(400)
    expect.assertions(1)
    return http
      .get({
        url: '/400',
      })
      .catch(err => {
        expect(err.message).toBe(sys.api.errMsg400)
      })
  })
  test('接口报错401', () => {
    mock.onAny('/401').reply(401)
    expect.assertions(1)
    return http
      .get({
        url: '/401',
      })
      .catch(err => {
        expect(err.message).toBe(sys.api.errMsg401)
      })
  })
  test('接口报错403', () => {
    mock.onAny('/403').reply(403)
    expect.assertions(1)
    return http
      .get({
        url: '/403',
      })
      .catch(err => {
        expect(err.message).toBe(sys.api.errMsg403)
      })
  })
  test('接口报错404', () => {
    mock.onAny('/404').reply(404)
    expect.assertions(1)
    return http
      .get({
        url: '/404',
      })
      .catch(err => {
        expect(err.message).toBe(sys.api.errMsg404)
      })
  })
  test('接口报错405', () => {
    mock.onAny('/405').reply(405)
    expect.assertions(1)
    return http
      .get({
        url: '/405',
      })
      .catch(err => {
        expect(err.message).toBe(sys.api.errMsg405)
      })
  })
  test('接口报错408', () => {
    mock.onAny('/408').reply(408)
    expect.assertions(1)
    return http
      .get({
        url: '/408',
      })
      .catch(err => {
        expect(err.message).toBe(sys.api.errMsg408)
      })
  })
  test('接口报错500', () => {
    mock.onAny('/500').reply(500)
    expect.assertions(1)
    return http
      .get({
        url: '/500',
      })
      .catch(err => {
        expect(err.message).toBe(sys.api.errMsg500)
      })
  })
  test('接口报错501', () => {
    mock.onAny('/501').reply(501)
    expect.assertions(1)
    return http
      .get({
        url: '/501',
      })
      .catch(err => {
        expect(err.message).toBe(sys.api.errMsg501)
      })
  })
  test('接口报错502', () => {
    mock.onAny('/502').reply(502)
    expect.assertions(1)
    return http
      .get({
        url: '/502',
      })
      .catch(err => {
        expect(err.message).toBe(sys.api.errMsg502)
      })
  })
  test('接口报错503', () => {
    mock.onAny('/503').reply(503)
    expect.assertions(1)
    return http
      .get({
        url: '/503',
      })
      .catch(err => {
        expect(err.message).toBe(sys.api.errMsg503)
      })
  })
  test('接口报错504', () => {
    mock.onAny('/504').reply(504)
    expect.assertions(1)
    return http
      .get({
        url: '/504',
      })
      .catch(err => {
        expect(err.message).toBe(sys.api.errMsg504)
      })
  })
  test('接口报错505', () => {
    mock.onAny('/505').reply(505)
    expect.assertions(1)
    return http
      .get({
        url: '/505',
      })
      .catch(err => {
        expect(err.message).toBe(sys.api.errMsg505)
      })
  })
  test('接口报错unknown', () => {
    mock.onAny('/unknown').reply(700)
    expect.assertions(1)
    return http
      .get({
        url: '/unknown',
      })
      .catch(err => {
        expect(err.message).toBe(sys.api.errMsgUnknown)
      })
  })
})
