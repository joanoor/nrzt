/**
 * dm(data manipulate: 数据操纵)
 */

import { isEqual, flatten, cloneDeep } from 'lodash-es'
import { isArray, isNumber, isString } from './is'
import { deepmerge } from '..'

interface TreeHelperConfig {
  id: string
  children: string
  pid: string
}

// 默认配置
const DEFAULT_CONFIG: TreeHelperConfig = {
  id: 'id',
  children: 'children',
  pid: 'pid',
}

// 获取配置。  Object.assign 从一个或多个源对象复制到目标对象
const getConfig = (config: Partial<TreeHelperConfig>) =>
  deepmerge(DEFAULT_CONFIG, config)

/**
 * 查找数组中重复值的index
 * @param arr 要查找的数组
 * @param key 生成指定key组成的数组
 *
 * @example
 *
 * const indexes = pickDuplicate([1,2,3])  // []
 * const indexes2 = pickDuplicate([1,2,2,3])  // [1,2]
 * const indexes3 = pickDuplicate([1, 2, 10, 5, 5, 7, 7, 9, 9, 9, 10]) // [[2, 10],[3, 4],[5, 6],[7, 8, 9]]
 */
export const pickDuplicate = (arr: any[], key?: any) => {
  const result: number[][] = []
  if (arr.length === 0 || arr.length === 1) {
    return result
  }
  let i = 0
  while (i < arr.length - 1) {
    let keys: number[] = []
    const conditions = flatten(result)
    if (conditions.indexOf(i) > -1) {
      i++
      continue
    }
    let j = 0
    while (j < arr.length) {
      if (i === j) j++
      if (conditions.indexOf(j) > -1) {
        j++
        continue
      }
      if (isEqual(arr[i], arr[j])) {
        if (isString(key) || isNumber(key)) {
          if (isEqual(arr[i], key)) {
            keys.push(i, j)
            j++
            continue
          }
        } else if (isArray(key) && key.length > 0) {
          for (const k of key) {
            if (isEqual(arr[i], k)) {
              keys.push(i, j)
            }
          }
        } else {
          keys.push(i, j)
        }
      }
      j++
    }
    i++
    keys = [...new Set(keys)]
    if (keys.length > 0) {
      result.push(keys)
    }
  }
  return result
}

/**
 * 获取数组的最大深度（也就是获取数组的维度。因为至少都是一维数组，所以deep默认为1）
 */
export const getDepth = (arr: any[], deep = 1): number => {
  for (const item of arr) {
    if (Array.isArray(item)) {
      return getDepth(item, ++deep)
    } else {
      continue
    }
  }
  return deep
}

/**
 * 将数组按指定key转换成响应的对象
 * @param data
 * @param key
 */
export const arrayChangeToObj = (d: Recordable[], key: string) => {
  if (!d) return {}
  const data = cloneDeep(d)
  return data.reduce((acc, cur) => {
    acc[cur[key]] = cur
    return acc
  }, {})
}

/**
 * @deprecated
 * [已废弃]建议使用listToTree
 */
export const changeToTree = (
  d: Recordable[],
  key = 'id',
  pkey = 'parentId'
) => {
  const ckey = 'children'
  const data = cloneDeep(d)
  let flag = false // 字段保证顺序是否变化
  if (!key || !data) return []

  let tree: any[] = []
  const names: string[] = []
  const parents: Recordable = {}
  data.forEach(item => {
    names.push(item[key] + '_')
    // 父类相同的分类
    parents[item[pkey] + '_'] = parents[item[pkey] + '_'] || []
    parents[item[pkey] + '_'].push(item)
  })
  data.forEach(item => {
    if (parents[item[key] + '_'] && item[pkey] !== item[key]) {
      flag = true
      item[ckey] = [...parents[item[key] + '_']]
    }
  })
  // 保证顺序不能变(前提是：没有子节点)
  if (flag) {
    // 获取根节点
    for (const keyName in parents) {
      if (names.indexOf(keyName) < 0) {
        tree.push(...parents[keyName])
      }
    }
  } else {
    tree = cloneDeep(data)
  }
  return tree
}

export function listToTree<T = any>(
  list: any[],
  config: Partial<TreeHelperConfig> = {}
): T[] {
  const conf = getConfig(config) as TreeHelperConfig
  const nodeMap = new Map()
  const result: T[] = []
  const { id, children, pid } = conf

  for (const node of list) {
    node[children] = node[children] || []
    nodeMap.set(node[id], node)
  }
  for (const node of list) {
    const parent = nodeMap.get(node[pid])
    ;(parent ? parent[children] : result).push(node)
  }
  return result
}

export function treeToList<T = any>(
  tree: any,
  config: Partial<TreeHelperConfig> = {}
): T {
  config = getConfig(config)
  const { children } = config
  const result: any = [...tree]
  for (let i = 0; i < result.length; i++) {
    if (!result[i][children!]) continue
    result.splice(i + 1, 0, ...result[i][children!])
  }
  return result
}

export function findNode<T = any>(
  tree: any,
  func: Fn,
  config: Partial<TreeHelperConfig> = {}
): T | null {
  config = getConfig(config)
  const { children } = config
  const list = [...tree]
  for (const node of list) {
    if (func(node)) return node
    node[children!] && list.push(...node[children!])
  }
  return null
}

export function findNodeAll<T = any>(
  tree: any,
  func: Fn,
  config: Partial<TreeHelperConfig> = {}
): T[] {
  config = getConfig(config)
  const { children } = config
  const list = [...tree]
  const result: T[] = []
  for (const node of list) {
    func(node) && result.push(node)
    node[children!] && list.push(...node[children!])
  }
  return result
}

export function findPath<T = any>(
  tree: any,
  func: Fn,
  config: Partial<TreeHelperConfig> = {}
): T | T[] | null {
  config = getConfig(config)
  const path: T[] = []
  const list = [...tree]
  const visitedSet = new Set()
  const { children } = config
  while (list.length) {
    const node = list[0]
    if (visitedSet.has(node)) {
      path.pop()
      list.shift()
    } else {
      visitedSet.add(node)
      node[children!] && list.unshift(...node[children!])
      path.push(node)
      if (func(node)) {
        return path
      }
    }
  }
  return null
}

export function findPathAll(
  tree: any,
  func: Fn,
  config: Partial<TreeHelperConfig> = {}
) {
  config = getConfig(config)
  const path: any[] = []
  const list = [...tree]
  const result: any[] = []
  const visitedSet = new Set(),
    { children } = config
  while (list.length) {
    const node = list[0]
    if (visitedSet.has(node)) {
      path.pop()
      list.shift()
    } else {
      visitedSet.add(node)
      node[children!] && list.unshift(...node[children!])
      path.push(node)
      func(node) && result.push([...path])
    }
  }
  return result
}

export function filter<T = any>(
  tree: T[],
  func: (n: T) => boolean,
  // Partial 将 T 中的所有属性设为可选
  config: Partial<TreeHelperConfig> = {}
): T[] {
  // 获取配置
  config = getConfig(config)
  const children = config.children as string

  function listFilter(list: T[]) {
    return list
      .map((node: any) => ({ ...node }))
      .filter(node => {
        // 递归调用 对含有children项  进行再次调用自身函数 listFilter
        node[children] = node[children] && listFilter(node[children])
        // 执行传入的回调 func 进行过滤
        return func(node) || (node[children] && node[children].length)
      })
  }

  return listFilter(tree)
}

export function forEach<T = any>(
  tree: T[],
  func: (n: T) => any,
  config: Partial<TreeHelperConfig> = {}
): void {
  config = getConfig(config)
  const list: any[] = [...tree]
  const { children } = config
  for (let i = 0; i < list.length; i++) {
    //func 返回true就终止遍历，避免大量节点场景下无意义循环，引起浏览器卡顿
    if (func(list[i])) {
      return
    }
    children && list[i][children] && list.splice(i + 1, 0, ...list[i][children])
  }
}

/**
 * @description: Extract tree specified structure
 * @description: 提取树指定结构
 */
export function treeMap<T = any>(
  treeData: T[],
  opt: { children?: string; conversion: Fn }
): T[] {
  return treeData.map(item => treeMapEach(item, opt))
}

/**
 * @description: Extract tree specified structure
 * @description: 提取树指定结构
 */
export function treeMapEach(
  data: any,
  { children = 'children', conversion }: { children?: string; conversion: Fn }
) {
  const haveChildren =
    Array.isArray(data[children]) && data[children].length > 0
  const conversionData = conversion(data) || {}
  if (haveChildren) {
    return {
      ...conversionData,
      [children]: data[children].map((i: number) =>
        treeMapEach(i, {
          children,
          conversion,
        })
      ),
    }
  } else {
    return {
      ...conversionData,
    }
  }
}

/**
 * 递归遍历树结构
 * @param treeDatas 树
 * @param callBack 回调
 * @param parentNode 父节点
 */
export function eachTree(treeDatas: any[], callBack: Fn, parentNode = {}) {
  treeDatas.forEach(element => {
    const newNode = callBack(element, parentNode) || element
    if (element.children) {
      eachTree(element.children, callBack, newNode)
    }
  })
}
