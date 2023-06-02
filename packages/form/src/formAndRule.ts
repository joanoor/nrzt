/**
  生成表单解构以及表单校验规则
 */

import { _console, isEmpty, pickDuplicate } from '@nrzt/core'
import type { Rules, RuleItem } from 'async-validator'

interface RuleItemExtend extends RuleItem {
  trigger: string
}

export type RuleItemExtend2 = RuleItemExtend | RuleItemExtend[]

export interface BaseStruct<T = string, R = boolean> {
  label: T // form表单项名称
  default: T | number // form表单项默认值
  required: R // form表单项是否含有校验规则
  rule: RuleItemExtend2 // form表单项校验规则
  id: T // form表单重名时，通过id来进行区分
}

export type BaseStructs = BaseStruct[]

/**
 * 判断是否为BaseStruct类型
 * @param val
 */
function isBaseStruct(val: unknown): val is BaseStruct<string, boolean> {
  return !isEmpty(val)
}

/**
 * 经过计算，返回baseStructs中的属于form的对象
 * @param optLabel
 * @param baseStructs
 * @param uniqIds
 */
function optFactory(
  optLabel: string,
  baseStructs: BaseStructs,
  uniqIds: string[]
  // eslint-disable-next-line @typescript-eslint/ban-types
): BaseStruct | {} | undefined {
  // 第一步：将提供的数据中，所有的label组成数组
  const labels = baseStructs.map(v => v.label)

  // 第二步：确定提供的数据中，是否存在重复的label
  const dupLabelObjs = baseStructs.filter(v => v.label === optLabel)

  // 说明提供的label，不在提供的数据中
  if (dupLabelObjs.length === 0) {
    return {}
  }

  // true 表示存在重复  false 表示不存在重复
  const isDup = dupLabelObjs.length > 1

  // 第三步：判断label重复的对象组成的数组中是否存在重复的id
  if (!isDup) {
    const obj = baseStructs.find(v => v.label === optLabel)
    return obj ? obj : {}
  } else {
    const ids = dupLabelObjs.map(v => v.id)
    // true 表示label重复的对象组成的数组中，不存在重复的id
    const isDupId = [...new Set(ids)].length === ids.length
    if (!isDupId) {
      const indexes = pickDuplicate(labels, optLabel)
      throw new Error(
        `提供的数据有误。存在“label重复，id也重复”的情况。发生于索引为：${indexes.join()}的数据中`
      )
    } else {
      const obj = baseStructs.find(v => {
        return v.label === optLabel && uniqIds.indexOf(v.id) > -1
      })
      return obj ? obj : {}
    }
  }
}

/**
 * 使用optFactory方法，生成表单对象或者表单校验对象
 * @param array form表单对象的key值组成的字符串数组
 * @param baseFormAndRuleList 传入BaseStructs类型的数据
 * @param uniqIds 可选。
 * @param type 可选。生成对象类型，表单对象不需要传，表单校验对象需传入任意不为空的数据
 * @returns {Record<string, any> | Rules}
 */
function generateOptions(
  array: string[],
  baseFormAndRuleList: BaseStructs,
  uniqIds: string[] = [],
  type = ''
): Record<string, any> | Rules {
  let result = {}
  if (baseFormAndRuleList.length === 0) {
    _console.error('generateOptions传参错误，为空数组')
  } else {
    result = array.reduce((acc, cur) => {
      const obj = optFactory(cur, baseFormAndRuleList, uniqIds)

      if (isBaseStruct(obj)) {
        // 生成form表单对象
        if (!type) obj.label && (acc[obj.label] = obj.default)
        // 生成form表单对象的校验规则
        else obj.label && (acc[obj.label] = obj.rule)
        // else obj.label && obj.required && (acc[obj.label] = obj.rule) // 这里不能校验obj.required 因为有的时候不是必填项也需要进行校验
      }

      return acc
    }, {} as Recordable)
  }
  return result
}

/**
 * 使用generateOptions方法，生成form以及formRule的返回对象（符合Element UI中表单校验格式）
 * @param formopts 
 * @param baseFormAndRuleList 
 * @param uniqIds 当我们把整个项目的表单数据整理到一个模块中，难免会出现重名的情况，这时，需要uniqId这个字符串数组，将id在uniqId中的表单提取出来
 * @example
 * ```js
 * const [_form, _rules] = generateFormAndRules(
     ['username', 'password'],
     baseFormAndRuleList
   )
   ```
 */
export function generateFormAndRules(
  formopts: string[],
  baseFormAndRuleList: BaseStructs,
  uniqIds?: string[]
): [Record<string, any>, Rules] {
  let _form = {}
  let _rules = {}
  if (formopts.length === 0) {
    _console.error('生成表单及表单规则出错，没有传入参数或传入参数不是非空数组')
  } else {
    _form = generateOptions(formopts, baseFormAndRuleList, uniqIds)
    _rules = generateOptions(formopts, baseFormAndRuleList, uniqIds, 'rule')
  }
  return [_form, _rules]
}
