import { pattern } from '@nrzt/core'
import type {
  InternalRuleItem,
  Value,
  Values,
  ValidateOption,
  SyncValidateResult,
} from 'async-validator'

interface ValidatorInterface {
  (
    rule: InternalRuleItem,
    value: Value,
    callback: (error?: string | Error) => void,
    source: Values,
    options: ValidateOption
  ): SyncValidateResult | void
}

class FormChecker {
  // 分数校验
  scoreChecker(): ValidatorInterface {
    return (_rule, value, callback) => {
      if (!value || value === '') {
        callback(new Error('请输入得分规则'))
      } else {
        callback()
      }
    }
  }

  // 手机号码校验
  phoneChecker(): ValidatorInterface {
    return (_rule, value, callback) => {
      if (!pattern.testMobile(value.trim())) {
        callback(new Error('请输入正确的手机号码'))
      } else {
        callback()
      }
    }
  }

  // 简单密码校验
  easyPasswordChecker(): ValidatorInterface {
    return (_rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入密码'))
      } else if (value.length < 6 || value.length > 20) {
        callback(new Error('密码长度范围在6-20位'))
      } else {
        callback()
      }
    }
  }

  emailChecker(): ValidatorInterface {
    return (_rule, value, callback) => {
      if (!pattern.testEmail(value.trim())) {
        callback(new Error('请输入正确的邮箱'))
      } else {
        callback()
      }
    }
  }
}

export const formChecker = new FormChecker()
