import { createAxios } from '../index'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { IAxios } from '../src/Axios'

describe('测试IAxios基础请求', () => {
  let mock: MockAdapter
  let http: IAxios

  beforeEach(() => {
    mock = new MockAdapter(axios)
    http = createAxios()
  })

  test('get请求', async () => {
    mock.onGet('/normalGet').reply(200, {
      users: [{ id: 1, name: 'John Smith' }],
    })
    const res = await http.get({ url: '/normalGet' })
    expect(res).toEqual({
      users: [{ id: 1, name: 'John Smith' }],
    })
  })

  test('post请求', async () => {
    mock
      .onPost('/normalPost', { title: 'foo', body: 'bar', userId: 1 })
      .reply(200, {
        id: 101,
        title: 'foo',
        body: 'bar',
        userId: 1,
      })

    const res = await http.post({
      url: '/normalPost',
      data: {
        title: 'foo',
        body: 'bar',
        userId: 1,
      },
    })
    expect(res).toEqual({
      id: 101,
      title: 'foo',
      body: 'bar',
      userId: 1,
    })
  })

  test('post请求(x-www-form-urlencoded方式)', async () => {
    const headers = {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/x-www-form-urlencoded',
    }
    const data = {
      title: 'foo',
      body: 'bar',
      userId: 1,
    }
    mock.onPost('/withHeaders', data, headers).reply(200)

    const res = await http.post(
      {
        url: '/withHeaders',
        data,
        headers: headers,
      },
      {
        isReturnNativeResponse: true,
      }
    )
    expect(res.status).toBe(200)
  })

  test('put请求', async () => {
    const data = {
      id: 1,
      title: 'foo',
      body: 'bar',
      userId: 1,
    }
    mock.onPut('/normalPut', data).reply(200)
    const res = await http.put(
      {
        url: '/normalPut',
        data,
      },
      {
        isReturnNativeResponse: true,
      }
    )
    expect(res.status).toEqual(200)
  })

  test('delete请求', async () => {
    mock.onDelete('/normalDelete').reply(200)
    const res = await http.delete(
      {
        url: '/normalDelete',
      },
      {
        isReturnNativeResponse: true,
      }
    )

    expect(res.status).toEqual(200)
  })

  test('request请求', async () => {
    mock.onAny('/normalRequest').reply(200)
    const res = await http.request(
      {
        url: '/normalRequest',
        method: 'get',
      },
      {
        isReturnNativeResponse: true,
      }
    )
    expect(res.status).toBe(200)
  })

  test('prefix请求', async () => {
    mock.onGet('/prefix/join').reply(200)
    const res = await http.get(
      {
        url: '/join',
      },
      {
        joinPrefix: true,
        isReturnNativeResponse: true,
      }
    )

    expect(res.status).toBe(200)
  })
})
