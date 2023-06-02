import { default as deepmerge2 } from 'deepmerge'

export * from './src/bem'
export * from './src/color'
export * from './src/data'
export * from './src/date'
export * from './src/dom'
export * from './src/file'
export * from './src/is'
export * from './src/utils'
export * from './src/validType'

export const deepmerge = deepmerge2
export {
  cloneDeep,
  debounce,
  throttle,
  omit,
  pick,
  set,
  upperCase,
  upperFirst,
  trim,
} from 'lodash-es'
