import { EncryptionFactory, type Encryption } from '@nrzt/cipher'
import { defaultCacheCipher, DEFAULT_CACHE_TIME } from './constant'
import { CreateStorageParams, Options } from './types'
import { WebStorage } from './WebStorage'

/************************************************************/

const createWebStorage = ({
  prefixKey = '',
  storage = localStorage,
  hasEncrypt = true,
  timeout = null,
  key = defaultCacheCipher.key,
  iv = defaultCacheCipher.iv,
}: Partial<CreateStorageParams> = {}) => {
  if (hasEncrypt && [key.length, iv.length].some(item => item !== 16)) {
    throw new Error('When hasEncrypt is true, the key or iv must be 16 bits!')
  }

  // const encryption = new AesEncryption({ key, iv })
  const encryption: Encryption = EncryptionFactory.createAesEncryption({
    key,
    iv,
  })

  return new WebStorage({
    storage,
    encryption,
    hasEncrypt,
    prefixKey,
    timeout,
  })
}

const createStorage = (
  storage: Storage = sessionStorage,
  options: Options = {}
) => {
  return createWebStorage({
    storage,
    ...options,
  })
}

export const createSessionStorage = (options: Options = {}) => {
  return createStorage(sessionStorage, {
    ...options,
    timeout: DEFAULT_CACHE_TIME,
  })
}

export const createLocalStorage = (options: Options = {}) => {
  return createStorage(localStorage, {
    ...options,
    timeout: DEFAULT_CACHE_TIME,
  })
}
