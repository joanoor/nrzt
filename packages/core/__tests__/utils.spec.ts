import * as utils from '../src/utils'
// import fs from 'fs'
// import path from 'path'
/**
 * 预备测试require.context
 */
// if (typeof require.context === 'undefined') {
//   Object.defineProperty(require, 'context', {
//     value: function (
//       base = '.',
//       scanSubDirectories = false,
//       regularExpression = /\.(js|ts)$/
//     ): Partial<__WebpackModuleApi.RequireContext> {
//       const files = {}
//       function readDirectory(directory) {
//         fs.readdirSync(directory).forEach(file => {
//           const fullPath = path.resolve(directory, file)
//           if (fs.statSync(fullPath).isDirectory()) {
//             if (scanSubDirectories) readDirectory(fullPath)
//             return
//           }

//           if (!regularExpression.test(fullPath)) return
//           files[fullPath] = true
//         })
//       }

//       readDirectory(path.resolve(__dirname, base))
//       function Module(file) {
//         return require(file)
//       }
//       console.log('files', files)
//       Module.keys = () => Object.keys(files)
//       return Module
//     },
//   })
// }

describe(`测试utils模块代码`, () => {
  test('测试_console对象', () => {
    const spyLog = jest.spyOn(utils._console, 'log')
    const spyWarn = jest.spyOn(utils._console, 'warn')
    const spyError = jest.spyOn(utils._console, 'error')
    const spySuccess = jest.spyOn(utils._console, 'success')

    utils._console.log('test _console.log')
    expect(spyLog).toHaveBeenCalled()
    expect(spyLog).toHaveBeenCalledTimes(1)
    expect(spyLog).toHaveBeenCalledWith('test _console.log')

    utils._console.warn('test _console.warn')
    expect(spyWarn).toHaveBeenCalled()
    expect(spyWarn).toHaveBeenCalledTimes(1)
    expect(spyWarn).toHaveBeenCalledWith('test _console.warn')

    utils._console.error('test _console.error')
    expect(spyError).toHaveBeenCalled()
    expect(spyError).toHaveBeenCalledTimes(1)
    expect(spyError).toHaveBeenCalledWith('test _console.error')

    utils._console.success('test _console.success')
    expect(spySuccess).toHaveBeenCalled()
    expect(spySuccess).toHaveBeenCalledTimes(1)
    expect(spySuccess).toHaveBeenCalledWith('test _console.success')

    jest.restoreAllMocks()
  })

  test('测试scrollToTop方法', () => {
    // const mockFn = jest.fn(utils.scrollToTop)  // 这种写法看起来好像也可以执行original function。但本质上还是创建了一个与original function一样的function。
    const mockFn = jest.spyOn(utils, 'scrollToTop')

    document.body.innerHTML = `
      <div id="app"></div>
    `
    const myDiv = document.getElementById('app')
    if (myDiv) {
      utils.scrollToTop(myDiv)
      expect(mockFn).toHaveBeenCalledTimes(1)
      expect(mockFn).toHaveBeenCalledWith(myDiv)
    } else {
      throw new Error('参数错误，页面中没有找到相应容器')
    }
  })

  describe('测试loadScript方法', () => {
    const url = `https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js`
    const placeHolder = 'jquery'

    test('使用resolves匹配器', async () => {
      const mockLoadScript = jest.spyOn(utils, 'loadScript')

      const res1 = await utils.loadScript(url, placeHolder)
      expect(mockLoadScript).toHaveBeenCalledTimes(1)
      expect(res1).toBe(true)
      const script = document.head.querySelector(`[src*="${placeHolder}"]`)
      expect(script).not.toBeNull()
      expect((script as HTMLScriptElement).src).toBe(url)

      const res2 = await utils.loadScript(url, placeHolder)
      expect(res2).toBe('已经加载成功')
    })
  })

  describe('pollingAction', () => {
    beforeEach(() => {
      jest.useFakeTimers()
    })

    afterEach(() => {
      jest.clearAllTimers()
      jest.useRealTimers()
    })

    test('测试非立即执行轮询', () => {
      const time = 1000
      const callback = jest.fn()

      const setInterval = jest.spyOn(global, 'setInterval')
      const po = new utils.PollingAction(callback, time)

      po.start()
      expect(setInterval).toBeCalled()
      expect(setInterval).toBeCalledTimes(1)
      expect(callback).not.toBeCalled()

      jest.advanceTimersByTime(time)
      expect(callback).toBeCalled()
      expect(callback).toBeCalledTimes(1)

      jest.runOnlyPendingTimers()
      expect(callback).toBeCalledTimes(2)

      po.cancel()
      jest.runOnlyPendingTimers()
      expect(callback).toBeCalledTimes(2)
    })

    test('测试立即执行轮询', () => {
      const time = 1000
      const callback = jest.fn()
      const po = new utils.PollingAction(callback, time, true)
      po.start()
      expect(callback).toBeCalled()
      jest.runOnlyPendingTimers()
      expect(callback).toBeCalled()
      expect(callback).toBeCalledTimes(2)

      jest.runOnlyPendingTimers()
      expect(callback).toBeCalledTimes(3)

      po.cancel()
      jest.runOnlyPendingTimers()
      expect(callback).toBeCalledTimes(3)
    })

    test('测试出错的情况下，结束轮询', () => {
      const time = 1000
      const callbackError = jest.fn(() => {
        throw new Error('出错了')
      })
      const poError = new utils.PollingAction(callbackError, time, true)

      expect(() => poError.start()).toThrow('出错了')
      expect(callbackError).toBeCalled()

      const poError2 = new utils.PollingAction(callbackError, time)
      poError2.start()
      jest.runOnlyPendingTimers()
      expect(callbackError).toBeCalled()
    })
  })

  test('测试getPropValue方法', () => {
    const obj = {
      name: 'xixi',
      age: 24,
    }
    const mockGetPropValue = jest.spyOn(utils, 'getPropValue')

    expect(utils.getPropValue(obj, 'name')).toBe('xixi')
    expect(mockGetPropValue).toBeCalled()
    expect(mockGetPropValue).toBeCalledWith(obj, 'name')
    expect(utils.getPropValue(obj, 'age')).toBe(24)
    expect(mockGetPropValue).toBeCalledTimes(2)
    expect(mockGetPropValue).toBeCalledWith(obj, 'age')
  })

  test('测试deepMerge深度合并', () => {
    const obj1 = {
      name: 'xixi',
      age: 24,
      child: {
        name: 'hihi',
        age: 0,
      },
    }
    const obj2 = {
      hobbies: ['code', 'sleep', 'sc2', 'db3'],
    }
    const obj3 = {
      age: 44,
      family: {
        address: 'china',
        phone: '+86-17799999999',
      },
      child: {
        age: 1,
      },
    }
    const mockDeepMerge = jest.spyOn(utils, 'mergeAll')
    const returnValue = utils.mergeAll(obj1, obj2, obj3)

    expect(mockDeepMerge).toBeCalled()
    expect(mockDeepMerge).toBeCalledTimes(1)
    expect(returnValue).toEqual({
      name: 'xixi',
      age: 44,
      hobbies: ['code', 'sleep', 'sc2', 'db3'],
      family: {
        address: 'china',
        phone: '+86-17799999999',
      },
      child: {
        name: 'hihi',
        age: 1,
      },
    })
  })

  test('测试setObjToUrlParams，将对象转换成字符串添加到url后面', () => {
    const obj = {
      offset: 0,
      limit: 10,
      type: 'to_fill',
    }
    const url = `api/evaluations/711860816856481792/blocks`
    const mockSetObjToUrlParams = jest.spyOn(utils, 'setObjToUrlParams')

    const returnValue = utils.setObjToUrlParams(url, obj)

    expect(mockSetObjToUrlParams).toBeCalled()
    expect(mockSetObjToUrlParams).toBeCalledTimes(1)
    expect(returnValue).toBe(
      `${url}?offset=${obj.offset}&limit=${obj.limit}&type=${obj.type}`
    )
  })

  test('测试randomHexColorCode，随机生成一串16进制颜色', () => {
    const mockRandomHexColorCode = jest.spyOn(utils, 'randomHexColorCode')
    const pattern = /^#[A-Fa-f0-9]{6}$/

    const returnValue = utils.randomHexColorCode()

    expect(mockRandomHexColorCode).toBeCalled()
    expect(mockRandomHexColorCode).toBeCalledTimes(1)
    expect(returnValue.length).toBe(7)
    expect(pattern.test(returnValue)).toBe(true)
  })

  describe('测试hexToRGB：将16进制颜色转换成rgb或者rgba', () => {
    test('当参数不符合16进制颜色的时候', () => {
      expect(() => utils.hexToRGB('3333')).toThrow('输入的参数不符合16进制颜色')
      expect(() => utils.hexToRGB('33335')).toThrow(
        '输入的参数不符合16进制颜色'
      )
      expect(() => utils.hexToRGB('3333777')).toThrow(
        '输入的参数不符合16进制颜色'
      )
      expect(() => utils.hexToRGB('#3333')).toThrow(
        '输入的参数不符合16进制颜色'
      )
      expect(() => utils.hexToRGB('#33335')).toThrow(
        '输入的参数不符合16进制颜色'
      )
      expect(() => utils.hexToRGB('#333377g')).toThrow(
        '输入的参数不符合16进制颜色'
      )
      expect(() => utils.hexToRGB('33t')).toThrow('输入的参数不符合16进制颜色')
      expect(() => utils.hexToRGB('33tree')).toThrow(
        '输入的参数不符合16进制颜色'
      )
      expect(() => utils.hexToRGB('#33tree')).toThrow(
        '输入的参数不符合16进制颜色'
      )
    })

    test('当参数符合16进制颜色的时候', () => {
      const mockHexToRGB = jest.spyOn(utils, 'hexToRGB')

      const returnValue3 = utils.hexToRGB('#333')
      expect(mockHexToRGB).toBeCalled()
      expect(mockHexToRGB).toBeCalledTimes(1)
      expect(returnValue3).toBe('rgb(51, 51, 51)')

      const returnValue6 = utils.hexToRGB('#333444')
      expect(mockHexToRGB).toBeCalled()
      expect(mockHexToRGB).toBeCalledTimes(2)
      expect(returnValue6).toBe('rgb(51, 52, 68)')

      const returnValue8 = utils.hexToRGB('#333444ff')
      expect(mockHexToRGB).toBeCalled()
      expect(mockHexToRGB).toBeCalledTimes(3)
      expect(returnValue8).toBe('rgba(51, 52, 68, 255)')
    })
  })

  describe('测试RGBToHex：将rgb颜色转换成16进制颜色', () => {
    test('不符合rgb的颜色', () => {
      expect(() => utils.RGBToHex('你好')).toThrow('非法的rgb颜色')
      expect(() => utils.RGBToHex('rga(44,44,44)')).toThrow('非法的rgb颜色')
      expect(() => utils.RGBToHex(4, 256, 277)).toThrow('非法的rgb颜色')
      expect(() => utils.RGBToHex('rgb(43,42)')).toThrow('非法的rgb颜色')
    })

    test('符合rgb的颜色', () => {
      const mockRGBToHex = jest.spyOn(utils, 'RGBToHex')
      expect(utils.RGBToHex('rgb(244,233,255)')).toBe('#f4e9ff')
      expect(mockRGBToHex).toBeCalledTimes(1)
      expect(utils.RGBToHex(244, 233, 255)).toBe('#f4e9ff')
      expect(mockRGBToHex).toBeCalledTimes(2)
    })
  })

  test('numberThousandths: 将输入的数字转换成千分位写法', () => {
    expect(utils.convertToThousands(34)).toBe('34')
    expect(utils.convertToThousands(1234)).toBe('1,234')
    expect(utils.convertToThousands(123456)).toBe('123,456')
  })

  test('arrScrambling: 将一个数组转换成乱序数组', () => {
    const mockArrScrambing = jest.spyOn(utils, 'arrScrambling')
    const arr = [1, 4, 7, 10]

    expect(utils.arrScrambling(arr).length).toBe(arr.length)
    expect(mockArrScrambing).toBeCalledTimes(1)
    expect(mockArrScrambing.mock.calls[0][0]).toEqual(arr)
  })

  test('randomString: 生成指定长度的一串随机字符串', () => {
    expect(utils.genRandomString(8).length).toBe(8)
    expect(utils.genRandomString(100).length).toBe(100)
  })

  test('firstLetterUpper: 将字符串首字母大写', () => {
    expect(utils.fistLetterUpper('')).toBe('')
    expect(utils.fistLetterUpper('abcd')).toBe('Abcd')
    expect(utils.fistLetterUpper('abcd')).toMatch(/^A/)
    expect(utils.fistLetterUpper('abcd')).not.toBe('abcd')
  })

  test('strToAsterisk: 将手机号码转换成中间四位为星号', () => {
    expect(utils.convertStrToAsterisk('17755429999')).toBe('177****9999')
    expect(utils.convertStrToAsterisk('18274648477555', 3, 9)).toBe('182******77555')
    expect(() => utils.convertStrToAsterisk('123')).toThrow(
      '字符串长度不能小于指定的区间'
    )
  })

  test('chineseMoney: 将数字转化为汉字大写金额', () => {
    const mockDigitUpperCase = jest.spyOn(utils, 'convertChineseMoney')
    expect(utils.convertChineseMoney(123.44)).toBe('壹佰贰拾叁元肆角肆分')
    expect(mockDigitUpperCase).toBeCalledWith(123.44)
    expect(utils.convertChineseMoney(123)).toBe('壹佰贰拾叁元整')
    expect(utils.convertChineseMoney(0.5)).toBe('伍角')
  })

  test('toFullScreen: 打开浏览器全屏', () => {
    const mockToFullScreen = jest.spyOn(utils, 'toFullScreen')
    utils.toFullScreen()
    expect(mockToFullScreen).toBeCalledTimes(1)
  })

  test('exitFullscreen: 退出浏览器全屏', () => {
    const mockExitFullscreen = jest.spyOn(utils, 'exitFullscreen')
    utils.exitFullscreen()
    expect(mockExitFullscreen).toBeCalledTimes(1)
  })
  test('approximatelyEqual', () => {
    const mockApproximatelyEqual = jest.spyOn(utils, 'approximatelyEqual')
    expect(utils.approximatelyEqual(1000000004, 1000000015, 50)).toBe(true)
    expect(mockApproximatelyEqual).toBeCalled()

    expect(utils.approximatelyEqual(1000000004, 1000000015, 10)).toBe(false)
  })

  test('sleep', async () => {
    const start = performance.now()
    const mockSleep = jest.spyOn(utils, 'sleep')
    for (let i = 0; i < 3; i++) {
      await utils.sleep(1000)
    }
    const end = performance.now()
    expect(mockSleep).toBeCalledTimes(3)
    const differ = end - start
    expect(utils.approximatelyEqual(differ, 3000, 80)).toBe(true)
  })

  describe('getUrlQuery', () => {
    // test('测试hash模式', () => {
    //   window.location.hash = '#/login?name=xixi'
    //   const mockGetUrlParam = jest.spyOn(utils, 'getUrlQuery')
    //   console.log(`你你你你你`, utils.getUrlQuery())
    //   expect(utils.getUrlQuery()).toEqual({
    //     name: 'xixi',
    //   })
    //   expect(mockGetUrlParam).toBeCalled()
    // })

    test('测试获取浏览器地址栏中的query', () => {
      window.location.assign(
        'http://www.baidu.com?__biz=MzAxODE4MTEzMA==&mid=2650078915&idx=1&sn=4bb48827bb32c7f859141d203fe7a90e&chksm=83da63a6b4adeab096481f1b46de1f45426496d51291598b6ba005b64720029bc52917fba441&scene=21'
      )
      expect(utils.getUrlQuery()).toEqual({
        __biz: 'MzAxODE4MTEzMA==',
        mid: '2650078915',
        idx: '1',
        sn: '4bb48827bb32c7f859141d203fe7a90e',
        chksm:
          '83da63a6b4adeab096481f1b46de1f45426496d51291598b6ba005b64720029bc52917fba441',
        scene: '21',
      })

      window.location.assign(
        'http://112.26.166.156:8090/login#/index?redirect=%2Fhome'
      )
      expect(utils.getUrlQuery()).toEqual({
        redirect: '/home',
      })
    })

    test('测试参数为空', () => {
      window.location.assign('http://www.baidu.com')
      expect(utils.getUrlQuery()).toEqual({})
    })
  })

  // describe('textSize', () => {
  //   test('测试字符串的css宽度', () => {
  //     expect(utils.textSize('我爱你', '32px').width).toEqual(96)
  //     expect(utils.textSize('你好啊啊啊啊').width).toEqual(84)
  //   })
  // })

  // describe('再次测试sleep', () => {
  //   beforeAll(() => {
  //     jest.useFakeTimers
  //   })

  //   test('睡眠3000ms', async () => {
  //     const callback = jest.fn()
  //     const act = async (callback: () => void) => {
  //       await utils.sleep(3000)
  //       callback()
  //     }

  //     const promise = act(callback)
  //     expect(callback).not.toHaveBeenCalled()
  //     jest.runAllTimers()
  //     await promise
  //     expect(callback).toBeCalledTimes(1)
  //   })
  // })
})
