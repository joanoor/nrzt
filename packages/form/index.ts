import type { FormInstance } from 'element-plus'
import type { ValidateFieldsError } from 'async-validator'

export * from './src/formAndRule'
export * from './src/formChecker'
export * from 'async-validator'

export type SubmitCallback = (
  isValid?: boolean,
  invalidFields?: ValidateFieldsError
) => void

export type ResetCallBack = (...args: any[]) => void

/**
 * 提交表单
 * @param func
 * @returns
 */
export const submitForm =
  (func: SubmitCallback) => (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate(func)
  }

/**
 * 重置表单
 * @param func
 * @returns
 */
export const resetForm =
  (func?: ResetCallBack) => (formEl: FormInstance | undefined) => {
    if (!formEl) return
    func && func()

    /**
     * 重置该表单项，将其值重置为初始值，并移除校验结果
     * (props?: FormItemProp | FormItemProp[]) => void
     */
    formEl.resetFields()
  }
