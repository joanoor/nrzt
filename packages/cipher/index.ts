import { encrypt, decrypt } from 'crypto-js/aes'
import { parse } from 'crypto-js/enc-utf8'
import pkcs7 from 'crypto-js/pad-pkcs7'
import ECB from 'crypto-js/mode-ecb'
import md5 from 'crypto-js/md5'
import UTF8 from 'crypto-js/enc-utf8'
import Base64 from 'crypto-js/enc-base64'
import JSEncrypt from 'JSEncrypt'

export interface EncryptionParams {
  key: string // 密钥
  iv: string // 密钥偏移量
}

// AES加密类
export class AesEncryption {
  private key
  private iv

  constructor(opt: Partial<EncryptionParams> = {}) {
    const { key, iv } = opt
    if (key) {
      this.key = parse(key)
    }
    if (iv) {
      this.iv = parse(iv)
    }
  }

  // AES加密
  encryptByAES(cipherText: string) {
    return this.key
      ? encrypt(cipherText, this.key, {
          mode: ECB,
          padding: pkcs7,
          iv: this.iv,
        }).toString()
      : ''
  }

  // AES解密
  decryptByAES(cipherText: string) {
    return this.key
      ? decrypt(cipherText, this.key, {
          mode: ECB,
          padding: pkcs7,
          iv: this.iv,
        }).toString(UTF8)
      : ''
  }
}

// base64加密
export function encryptByBase64(cipherText: string) {
  return UTF8.parse(cipherText).toString(Base64)
}

// base64解密
export function decodeByBase64(cipherText: string) {
  return Base64.parse(cipherText).toString(UTF8)
}

// md5加密
export function encryptByMd5(password: string) {
  return md5(password).toString()
}

/**
 * rsa加密
 * @param publicKey 公钥，一般由接口返回给前端
 * @param value 将被加密的字符串
 * @returns
 */
export const cmdRSAEncrypt = (publicKey: string, value: string) => {
  const Encrypt = new JSEncrypt({
    default_key_size: '1024',
  })
  Encrypt.setPublicKey(publicKey)
  return Encrypt.encrypt(value)
}
