import type { UseProRequestPlugin } from '../types'
import { isFunction } from 'lodash-es'
import { useMessage } from 'naive-ui'
import { $t, isI18nKey } from '@/locales/locales'

declare module '../types' {
  interface UseProRequestOptions<Data, Params extends any[]> {
    /**
     * 请求成功后的消息提示，配置 true 时文案为 "操作成功"
     */
    successTip?: I18nKeyPath | (string & {}) | true | ((data: Data, params: Params) => string)
    /**
     * 请求失败后的消息提示，配置 false 时禁用消息提示
     */
    errorTip?: I18nKeyPath | (string & {}) | false | ((error: Error, params: Params) => string)
  }
}

/**
 * 消息提示插件
 */
export const messageTipAfterRequestFinallyPlugin: UseProRequestPlugin<any, any[]> = (
  _,
  { successTip, errorTip },
) => {
  const message = useMessage()

  function resolveSuccessMessage(data: any, params: any[]) {
    if (!successTip) {
      return ''
    }
    if (successTip === true) {
      return $t('common.often.operationSuccess')
    }
    if (isFunction(successTip)) {
      return successTip(data, params)
    }
    return isI18nKey(successTip)
      ? $t(successTip)
      : successTip
  }

  function resolveErrorMessage(error: Error, params: any[]) {
    if (errorTip === undefined) {
      // 可以在这里区分错误类型
      return error.message
    }
    if (errorTip === false || errorTip === '') {
      return ''
    }
    if (isFunction(errorTip)) {
      return errorTip(error, params)
    }
    return isI18nKey(errorTip)
      ? $t(errorTip)
      : errorTip
  }

  return {
    onFinally: (params, data, error) => {
      if (!error) {
        const successMessage = resolveSuccessMessage(data, params)
        if (successMessage) {
          message.success(successMessage)
        }
      }
      else {
        const errorMessage = resolveErrorMessage(error, params)
        if (errorMessage) {
          message.error(errorMessage)
        }
      }
    },
  }
}
