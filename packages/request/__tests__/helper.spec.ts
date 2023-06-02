import * as helper from '../src/helper'
import { addTimeStamp, formatRequestDate } from '../src/helper'
import dayjs from 'dayjs'

describe('测试helper模块方法', () => {
  describe('addTimeStamp', () => {
    test('添加时间戳', () => {
      expect.assertions(2)
      expect(typeof addTimeStamp(true)).toBe('object')
      expect(typeof addTimeStamp(true, true)).toBe('string')
    })

    test('不添加时间戳', () => {
      expect.assertions(2)
      expect(addTimeStamp(false)).toEqual({})
      expect(addTimeStamp(false, true)).toBe('')
    })
  })

  describe('formatRequestDate', () => {
    test('格式化请求参数时间', () => {
      const mock = jest.spyOn(helper, 'formatRequestDate')
      formatRequestDate({
        time: dayjs(),
      })
      expect(mock).toBeCalledTimes(1)

      formatRequestDate({ time: '1990-10-10' })
      expect(mock).toBeCalledTimes(2)

      formatRequestDate({
        time: {
          now: '1990-10-10',
        },
      })
    })

    test('当参数不是对象的时候', () => {
      expect(formatRequestDate(new Date())).toBeUndefined()
    })
  })
})
