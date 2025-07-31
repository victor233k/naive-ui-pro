import type { Awaitable } from '@vueuse/core'
import type { UseRequestOptions, UseRequestService } from 'pro-naive-ui'
import { isFunction } from 'lodash-es'
import { useMessage, useModal } from 'naive-ui'
import {
  useRequest,

} from 'pro-naive-ui'

export interface UseHandleOptions<Data, Params extends any[]>
  extends Omit<UseRequestOptions<Data, Params>, 'manual'> {
  /**
   * 是否为删除操作，将会更改默认的提示文案为“删除成功”，但优先级低于 `successTip`
   */
  delete?: boolean
  /**
   * 成功后是否自动提示
   * @default '操作成功'
   */
  successTip?: string | false | ((data: Data, params: Params) => string)
  /**
   * 失败后是否自动提示
   * @default (error) => error.message
   */
  errorTip?: string | false | ((error: Error, params: Params) => string)
  /**
   * 是否需要确认操作
   * @default true
   */
  useConfirm?: boolean | ((params: Params) => Awaitable<boolean>)
  /**
   * 自定义确认操作妨害死
   * @param resolve 必须调用，且传入 `false` 时阻止后续操作
   * @param params 调用参数
   * @default
   * ```ts
   * () => {
   *   modal.create({
   *     preset: 'dialog',
   *     title: '提示',
   *     content: options.delete
   *        ? '您确定要删除选中的数据吗？'
   *        : '您确定要执行此操作吗？',
   *     onPositiveClick: () => resolve(true),
   *     onNegativeClick: () => resolve(false),
   *   })
   * }
   * ```
   */
  confirmFn?: (resolve: (value: boolean) => void, params: Params) => void
}

export function useHandle<Data, Params extends any[]>(
  service: UseRequestService<Data, Params>,
  options: UseHandleOptions<Data, Params> = {},
) {
  const message = useMessage()
  const modal = useModal()

  options = Object.assign(
    {
      successTip: options.delete ? '删除成功' : '操作成功',
      errorTip: e => e.message,
      useConfirm: true,
      confirmFn(resolve) {
        modal.create({
          preset: 'dialog',
          type: 'warning',
          title: '提示',
          positiveText: '确定',
          negativeText: '取消',
          content: options.delete
            ? '您确定要删除选中的数据吗？'
            : '您确定要执行此操作吗？',
          onPositiveClick: () => resolve(true),
          onNegativeClick: () => resolve(false),
        })
      },
    } as UseHandleOptions<Data, Params>,
    options,
  )

  const result = useRequest<Data, Params>(service, {
    ...options,
    manual: true,
    onSuccess(data, params) {
      if (options.successTip) {
        message.success(
          isFunction(options.successTip)
            ? options.successTip(data, params)
            : options.successTip,
        )
      }
      options.onSuccess?.(data, params)
    },
    onError(e, params) {
      if (options.errorTip) {
        message.error(
          isFunction(options.errorTip)
            ? options.errorTip(e, params)
            : options.errorTip,
        )
      }
      options.onError?.(e, params)
    },
  })

  const { runAsync } = result

  result.runAsync = async (...params) => {
    try {
      await runGuard(params)
      return runAsync(...params)
    }
    catch {
      return undefined as Data
    }
  }

  result.run = (...params) => {
    result.runAsync(...params)
  }

  result.refreshAsync = async () => {
    return result.runAsync(...(result.params.value ?? []))
  }

  result.refresh = () => {
    return result.run(...(result.params.value ?? []))
  }

  async function runGuard(params: Params) {
    const { useConfirm, confirmFn } = options
    const useConfirmValue = isFunction(useConfirm)
      ? await useConfirm(params)
      : useConfirm

    if (!useConfirmValue || !confirmFn)
      return

    const value = await new Promise<boolean>((resolve) => {
      confirmFn(resolve, params)
    })

    if (!value) {
      throw new Error('cancel')
    }
  }

  return result
}
