import type { EncryptionParams } from '@nrzt/cipher'

export interface CreateStorageParams extends EncryptionParams {
  prefixKey: string
  storage: Storage
  hasEncrypt: boolean
  timeout?: Nullable<number>
}

export interface Cache<T = any> {
  value?: T
  timeoutId?: ReturnType<typeof setTimeout>
  time?: number
  alive?: number
}

export type Options = Omit<Partial<CreateStorageParams>, 'storage'>
