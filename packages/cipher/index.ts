import { decrypt as aesDecrypt, encrypt as aesEncrypt } from 'crypto-js/aes'
import UTF8, { parse } from 'crypto-js/enc-utf8'
import pkcs7 from 'crypto-js/pad-pkcs7'
import CTR from 'crypto-js/mode-ctr'
import Base64 from 'crypto-js/enc-base64'
import MD5 from 'crypto-js/md5'
import SHA256 from 'crypto-js/sha256'
import SHA512 from 'crypto-js/sha512'
import JSEncrypt from 'JSEncrypt'

// Define an interface for encryption
// 定义一个加密器的接口
export interface Encryption {
  encrypt(plainText: string): string
  decrypt(cipherText: string): string
}
// Define an interface for Hashing
// 定义一个哈希算法的接口
export interface Hashing {
  hash(data: string): string
}

export interface EncryptionParams {
  key: string // 密钥
  iv: string // 密钥偏移量
}

// AES加密类
class AesEncryption implements Encryption {
  private readonly key
  private readonly iv

  constructor({ key, iv }: EncryptionParams) {
    this.key = parse(key)
    this.iv = parse(iv)
  }

  get getOptions() {
    return {
      mode: CTR,
      padding: pkcs7,
      iv: this.iv,
    }
  }

  encrypt(plainText: string) {
    return aesEncrypt(plainText, this.key, this.getOptions).toString()
  }

  decrypt(cipherText: string) {
    return aesDecrypt(cipherText, this.key, this.getOptions).toString(UTF8)
  }
}

// Define a singleton class for Base64 encryption
class Base64Encryption implements Encryption {
  private static instance: Base64Encryption

  private constructor() {}

  // Get the singleton instance
  // 获取单例实例
  public static getInstance(): Base64Encryption {
    if (!Base64Encryption.instance) {
      Base64Encryption.instance = new Base64Encryption()
    }
    return Base64Encryption.instance
  }

  encrypt(plainText: string) {
    return UTF8.parse(plainText).toString(Base64)
  }

  decrypt(cipherText: string) {
    return Base64.parse(cipherText).toString(UTF8)
  }
}

// Define a singleton class for MD5 Hashing
class MD5Hashing implements Hashing {
  private static instance: MD5Hashing

  private constructor() {}

  // Get the singleton instance
  // 获取单例实例
  public static getInstance(): MD5Hashing {
    if (!MD5Hashing.instance) {
      MD5Hashing.instance = new MD5Hashing()
    }
    return MD5Hashing.instance
  }

  hash(plainText: string) {
    return MD5(plainText).toString()
  }
}

// 定义一个SHA256 Hashing单例
class SHA256Hashing implements Hashing {
  private static instance: SHA256Hashing

  private constructor() {}

  // Get the singleton instance
  // 获取单例实例
  public static getInstance(): SHA256Hashing {
    if (!SHA256Hashing.instance) {
      SHA256Hashing.instance = new SHA256Hashing()
    }
    return SHA256Hashing.instance
  }

  hash(plainText: string) {
    return SHA256(plainText).toString()
  }
}

// 定义一个SHA512 Hashing单例
class SHA512Hashing implements Hashing {
  private static instance: SHA512Hashing

  private constructor() {}

  // Get the singleton instance
  // 获取单例实例
  public static getInstance(): SHA256Hashing {
    if (!SHA512Hashing.instance) {
      SHA512Hashing.instance = new SHA512Hashing()
    }
    return SHA512Hashing.instance
  }

  hash(plainText: string) {
    return SHA512(plainText).toString()
  }
}

export class EncryptionFactory {
  public static createAesEncryption(params: EncryptionParams): Encryption {
    return new AesEncryption(params)
  }

  public static createBase64Encryption(): Encryption {
    return Base64Encryption.getInstance()
  }
}

export class HashingFactory {
  public static createMD5Hashing(): Hashing {
    return MD5Hashing.getInstance()
  }

  public static createSHA256Hashing(): Hashing {
    return SHA256Hashing.getInstance()
  }

  public static createSHA512Hashing(): Hashing {
    return SHA512Hashing.getInstance()
  }
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
