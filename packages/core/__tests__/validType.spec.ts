import { pattern } from '../src/validType'

describe('测试validType模块', () => {
  test('testIdCardNo: 验证身份证号码', () => {
    expect(pattern.testIdCardNo('aaaa')).not.toBe(true)
    expect(pattern.testIdCardNo('')).not.toBe(true)
    expect(pattern.testIdCardNo('1404041999')).not.toBe(true)
    expect(pattern.testIdCardNo('340404199911252167')).toBe(true)
  })

  test('testCn: 验证是否全部都是中文', () => {
    expect(pattern.testCn('aaaa')).not.toBe(true)
    expect(pattern.testCn('')).not.toBe(true)
    expect(pattern.testCn('你好啊')).toBe(true)
    expect(pattern.testCn('龍')).toBe(true)
  })

  test('testMobile: 验证手机号码', () => {
    const mockTestMobile = jest.spyOn(pattern, 'testMobile')

    expect(pattern.testMobile('17755449194')).toBe(true)
    expect(mockTestMobile).toBeCalledTimes(1)

    expect(pattern.testMobile('1554242')).not.toBe(true)
    expect(mockTestMobile).toBeCalledTimes(2)

    expect(pattern.testMobile('')).not.toBe(true)
    expect(mockTestMobile).toBeCalledTimes(3)
  })

  test('testEmail: 验证邮箱地址', () => {
    const mockTestEmail = jest.spyOn(pattern, 'testEmail')
    expect(pattern.testEmail('1554353@qq.com')).toBe(true)
    expect(mockTestEmail).toBeCalledTimes(1)

    expect(pattern.testEmail('j@1')).not.toBe(true)
    expect(mockTestEmail).toBeCalledTimes(2)

    expect(pattern.testEmail('x@g.c')).not.toBe(true)
    expect(mockTestEmail).toBeCalledTimes(3)
  })

  test('testUrl: 验证是否为url链接', () => {
    const mockTestUrl = jest.spyOn(pattern, 'testUrl')

    expect(pattern.testUrl('www.google.com')).not.toBe(true)
    expect(mockTestUrl).toBeCalledTimes(1)

    expect(
      pattern.testUrl('http://wwww.google.com/1273648383/index.html#read')
    ).toBe(true)
    expect(mockTestUrl).toBeCalledTimes(2)

    expect(pattern.testUrl('mailto://joanoor@outlook.com')).not.toBe(true)
    expect(mockTestUrl).toBeCalledTimes(3)
  })

  test('testCarId: 验证是否为汽车牌照', () => {
    const mockTestCarId = jest.spyOn(pattern, 'testCarId')

    expect(pattern.testCarId('皖DHN055A')).not.toBe(true)
    expect(mockTestCarId).toBeCalledTimes(1)

    expect(pattern.testCarId('皖AHN05A')).toBe(true)
    expect(mockTestCarId).toBeCalledTimes(2)
  })

  test('testDate: 验证是否为日期', () => {
    const mockTestDate = jest.spyOn(pattern, 'testDate')

    expect(pattern.testDate('2012-10-10')).toBe(true)
    expect(pattern.testDate('20-20-20')).not.toBe(true)
    expect(
      pattern.testDate('2022-10-10 21:04:53 GMT+0800 (中国标准时间)')
    ).not.toBe(true)
    expect(pattern.testDate('2022-10-10 21:04:53')).not.toBe(true)
    expect(mockTestDate).toBeCalledTimes(4)
  })

  test('testHKMc: 测试港澳通行证', () => {
    expect(pattern.testHKMc('W0300')).not.toBe(true)
    expect(pattern.testHKMc('04948484')).not.toBe(true)
    expect(pattern.testHKMc('C03945837')).toBe(true)
  })

  test('testTaiWan: 验证是否为台湾通行证', () => {
    expect(pattern.testTaiWan('T04040404')).toBe(true)
    expect(pattern.testTaiWan('9486048')).not.toBe(true)
    expect(pattern.testTaiWan('T0000000a')).not.toBe(true)
    expect(pattern.testTaiWan('T00000000')).toBe(true)
  })

  test('testPassport: 验证是否为护照', () => {
    expect(pattern.testPassport('E75647464')).toBe(true)
  })

  test('testNum: 验证是否为整数', () => {
    expect(pattern.testNum('123')).toBe(true)
    expect(pattern.testNum('0123')).toBe(true)
  })

  test('testDecimal: 测试是否为小数', () => {
    expect(pattern.testDecimal('0.1111')).toBe(true)
  })

  test('testTwCome: 测试是否为台胞证', () => {
    expect(pattern.testTwCome('ddd')).not.toBe(true)
    expect(pattern.testTwCome('B0997305')).toBe(true)
    expect(pattern.testTwCome('30997305')).toBe(true)
  })

  test('testHmHid: 测试是否为港澳台居民居住证', () => {
    expect(pattern.testHmHid('dddd')).not.toBe(true)
    expect(pattern.testHmHid('930000123456789123')).not.toBe(true)
    expect(pattern.testHmHid('830000123456789123')).toBe(true)
  })

  test('testEmoji: 校验是否包含emoji表情', () => {
    expect(pattern.testEmoji('adsfsdf')).not.toBe(true)
    expect(pattern.testEmoji('  🌞adsfads')).toBe(true)
    expect(pattern.testEmoji('🌞')).toBe(true)
    expect(pattern.testEmoji('㈡㈢Ⅺ★№§■△▲◎‰€℀')).not.toBe(true)
    expect(pattern.testEmoji('⃣')).not.toBe(true)
    expect(pattern.testEmoji('©')).toBe(true)
    expect(pattern.testEmoji('㊗')).toBe(true)
    expect(pattern.testEmoji('⤴')).toBe(true)
    expect(pattern.testEmoji('⬅')).toBe(true)
    expect(pattern.testEmoji('℀')).toBe(true)
  })
})
