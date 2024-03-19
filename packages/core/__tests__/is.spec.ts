import {
  isClient,
  isElement,
  isEmpty,
  isHexColor,
  isNullOrUnDef,
  isPlainObject,
  isPromise,
  isServer,
  isUrl,
  isWindow,
} from '../src/is'

describe(`测试is模块`, () => {
  test('isPlainObject: Test if value is a object', () => {
    expect(isPlainObject({})).toBe(true)
    expect(isPlainObject(new Date())).not.toBe(true)
    expect(isPlainObject(null)).not.toBe(true)
    expect(isPlainObject({ a: 1 })).toBe(true)
  })

  test('isWindow', () => {
    expect(isWindow(window)).toBe(true)
  })

  test('isElement', () => {
    document.body.innerHTML = `
      <div id="app"></div>
    `
    expect(isElement(document)).not.toBe(true)
    expect(isElement(document.getElementById('app'))).toBe(true)
    expect(isElement(document.querySelector('div'))).toBe(true)
  })

  test('isServer and isClient', () => {
    expect(isServer).toBe(!isClient)
  })

  test('isUrl', () => {
    expect(isUrl('https://www.baidu.com')).toBe(true)
    expect(isUrl('https://jestjs.io/docs/troubleshooting#debugging')).toBe(true)
    expect(isUrl('http:///www.baidu')).toBe(true)
  })

  test('isEmpty', () => {
    expect(isEmpty(null)).not.toBe(true)
    expect(isEmpty(undefined)).not.toBe(true)
    expect(isEmpty(0)).not.toBe(true)
    expect(isEmpty([])).toBe(true)
    expect(isEmpty({})).toBe(true)
    expect(isEmpty('')).toBe(true)
    expect(isEmpty(new Map())).toBe(true)
    expect(isEmpty(new Set())).toBe(true)
  })

  test('isNullOrUnDef', () => {
    expect(isNullOrUnDef(null)).toBe(true)
    expect(isNullOrUnDef(undefined)).toBe(true)
    expect(isNullOrUnDef('')).not.toBe(true)
  })

  test('isPromise', () => {
    const aPromise = new Promise((resolve, reject) => {
      resolve({})
    })
    expect(isPromise(aPromise)).toBe(true)
    expect(isPromise(Promise)).not.toBe(true)
  })

  test('isHexColor', () => {
    expect(isHexColor('#fff')).toBe(true)
    expect(isHexColor('#ffffff')).toBe(true)
    expect(isHexColor('ffffff')).not.toBe(true)
    expect(isHexColor('rgb(255,255,255)')).not.toBe(true)
  })
})
