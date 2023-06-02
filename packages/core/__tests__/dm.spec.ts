import { arrayToObject, getDepth, pickDuplicate } from '../src/dm'

describe('测试dm模块', () => {
  test('检测数组中重复的值，获取他们的index', () => {
    expect(pickDuplicate([])).toEqual([])
    expect(pickDuplicate([1])).toEqual([])
    expect(pickDuplicate([1, 2, 1, 5, 7, 1])).toEqual([[0, 2, 5]])
    expect(
      pickDuplicate([
        { a: { b: { c: [1, 3, 6] } } },
        [0, 1],
        { a: { b: { c: [1, 3, 6] } } },
      ])
    ).toEqual([[0, 2]])
    expect(pickDuplicate([1, 2, 3])).toEqual([])
    expect(pickDuplicate([1, 2, 10, 5, 5, 7, 7, 9, 9, 9, 10])).toEqual([
      [2, 10],
      [3, 4],
      [5, 6],
      [7, 8, 9],
    ])

    expect(pickDuplicate(['', 1, '', 2, 4, 1])).toEqual([
      [0, 2],
      [1, 5],
    ])

    expect(pickDuplicate([1, 2, 10, 5, 5, 7, 7, 9, 9, 9, 10], 10)).toEqual([
      [2, 10],
    ])

    expect(pickDuplicate(['', 1, '', 2, 4, 1], '')).toEqual([[0, 2]])
    expect(pickDuplicate(['', 1, '', 2, 4, 1], ['', 1])).toEqual([
      [0, 2],
      [1, 5],
    ])
  })

  test('检测数组的最大深度', () => {
    expect(getDepth([1])).toBe(1)
    expect(getDepth([2, [1, 2, [3]]])).toBe(3)
    expect(getDepth([2, [[[[[[[[[1]]]]]]]]], [1, 2, [3]]])).toBe(10)
    expect(getDepth([2, [[[[[[[[[]]]]]]]]], [1, 2, [3]]])).toBe(10)
  })

  test('将数组按指定key转换成响应的对象', () => {
    const list1 = [
      {
        name: 'xixi',
        age: '26',
        id: '10001',
      },
      {
        name: 'liu',
        age: '28',
        id: '10002',
      },
    ]
    const list2 = [
      {
        name: 'xixi',
        age: '26',
        id: '10001',
      },
      {
        name: 'liu',
        age: '28',
        id: '10001',
      },
    ]

    expect(arrayToObject(list1, 'id')).toEqual({
      '10001': { name: 'xixi', age: '26', id: '10001' },
      '10002': {
        name: 'liu',
        age: '28',
        id: '10002',
      },
    })
    expect(arrayToObject(list2, 'id')).toEqual({
      '10001': { name: 'liu', age: '28', id: '10001' },
    })
  })
})
