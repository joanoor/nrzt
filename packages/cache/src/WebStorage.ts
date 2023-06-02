import { AesEncryption } from '@nrzt/cipher'
import { isNullOrUnDef } from '@nrzt/core'
import { CreateStorageParams } from './types'

interface WebStorageCon extends Omit<CreateStorageParams, 'key' | 'iv'> {
  encryption: AesEncryption
}

/**
 * Cache class
 * Construction parameters can be passed into localStorage, sessionStorage,
 * @class Cache
 * @example
 */
export class WebStorage {
  private storage: Storage
  private encryption: AesEncryption
  private hasEncrypt: boolean
  private prefixKey?: string
  private timeout: Nullable<number> = null

  constructor({
    storage,
    prefixKey,
    encryption,
    hasEncrypt,
    timeout,
  }: WebStorageCon) {
    this.storage = storage
    this.prefixKey = prefixKey
    this.encryption = encryption
    this.hasEncrypt = hasEncrypt
    this.timeout = timeout || null
  }

  private getKey(key: string) {
    return `${this.prefixKey}${key}`.toUpperCase()
  }

  /**
   * Set cache
   * @param {string} key
   * @param {*} value
   * @param {*} expire Expiration time in seconds
   * @memberof Cache
   */
  set(key: string, value: any, expire: number | null = this.timeout) {
    const stringData = JSON.stringify({
      value,
      time: Date.now(),
      expire: !isNullOrUnDef(expire)
        ? new Date().getTime() + expire * 1000
        : null,
    })
    const stringifyValue = this.hasEncrypt
      ? this.encryption.encryptByAES(stringData)
      : stringData
    this.storage.setItem(this.getKey(key), stringifyValue)
  }

  /**
   * Read cache
   * @param {string} key
   * @param {*} def 默认值
   * @memberof Cache
   */
  get(key: string, def: any = null): any {
    const val = this.storage.getItem(this.getKey(key))
    if (!val) return def

    try {
      const decVal = this.hasEncrypt ? this.encryption.decryptByAES(val) : val
      const data = JSON.parse(decVal)
      const { value, expire } = data
      if (isNullOrUnDef(expire) || expire >= new Date().getTime()) {
        return value
      }
      this.remove(key)
    } catch (e) {
      return def
    }
  }

  /**
   * Delete cache based on key
   * @param {string} key
   * @memberof Cache
   */
  remove(key: string) {
    this.storage.removeItem(this.getKey(key))
  }

  /**
   * Delete all caches of this instance
   */
  clear(): void {
    this.storage.clear()
  }
}
