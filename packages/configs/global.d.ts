/**
 * 任意类型的异步函数
 */
type AnyPromiseFunction = (...arg: any[]) => PromiseLike<any>

/**
 * 任意类型的普通函数
 */
type AnyNormalFunction = (...arg: any[]) => any

/******************************我是分割线******************************/

declare type PropValue<T, U extends keyof T> = NonNullable<T[U]>
declare type Recordable<T = any> = Record<string, T>
declare interface ReadonlyRecordable<T = any> {
  readonly [key: string]: T
}
declare type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>
}
declare type AnyFunction = AnyNormalFunction | AnyPromiseFunction
declare type ConstructorFunction = new (...args: any[]) => any
declare type Values<T> = T[keyof T]
declare type EventType = Event & MouseEvent & TouchEvent
declare type ReadonlyRecordable<T = any> = {
  readonly [key: string]: T
}
declare interface Fn<T = any, R = T> {
  (...arg: T[]): R
}
declare type RefType<T> = T | null

declare type LabelValueOptions = {
  label: string
  value: any
  [key: string]: string | number | boolean
}[]

declare type EmitType = (event: string, ...args: any[]) => void
declare type TargetContext = '_self' | '_blank'
declare interface ComponentElRef<T extends HTMLElement = HTMLDivElement> {
  $el: T
}
declare type ComponentRef<T extends HTMLElement = HTMLDivElement> =
  ComponentElRef<T> | null
declare type ElRef<T extends HTMLElement = HTMLDivElement> = Nullable<T>
declare interface PromiseFn<T = any, R = T> {
  (...arg: T[]): Promise<R>
}
declare type Nullable<T> = T | null
declare type TimeoutHandle = ReturnType<typeof setTimeout>
declare type IntervalHandle = ReturnType<typeof setInterval>
declare type Arrayable<T> = T[] | T
declare interface ChangeEvent extends Event {
  target: HTMLInputElement
}
declare interface WheelEvent {
  path?: EventTarget[]
}
declare type ExitFullscreen = typeof document.exitFullscreen
declare type RequestFullscreen =
  typeof document.documentElement.requestFullscreen

declare interface Document {
  webkitExitFullscreen: ExitFullscreen
  mozCancelFullScreen: ExitFullscreen
  msExitFullscreen: ExitFullscreen
}

declare interface HTMLElement {
  webkitRequestFullscreen: RequestFullscreen
  mozRequestFullScreen: RequestFullscreen
  msRequestFullscreen: RequestFullscreen
}
