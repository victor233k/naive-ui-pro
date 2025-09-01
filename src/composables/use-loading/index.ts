import type { Ref } from 'vue'
import type { LoadingOptions } from '@/directive/loading/types'
import { ref } from 'vue'
import { NLoading } from '@/directive/loading/service'

export interface UseLoadingOptions {
  /**
   * 是否自动关闭
   */
  autoClose?: boolean
  /**
   * 自动关闭延迟时间（毫秒）
   */
  autoCloseDelay?: number
  /**
   * 默认的 loading 配置
   */
  defaultOptions?: LoadingOptions
}

export interface UseLoadingReturn {
  /**
   * loading 状态
   */
  loading: Ref<boolean>
  /**
   * 显示 loading
   */
  show: (options?: LoadingOptions) => void
  /**
   * 隐藏 loading
   */
  hide: () => void
  /**
   * 包装异步函数，自动处理 loading 状态
   */
  wrap: <T extends any[], R>(
    fn: (...args: T) => Promise<R>,
    options?: LoadingOptions
  ) => (...args: T) => Promise<R>
}

/**
 * 使用 loading 的 composable
 */
export function useLoading(options: UseLoadingOptions = {}): UseLoadingReturn {
  const {
    autoClose = false,
    autoCloseDelay = 3000,
    defaultOptions = {},
  } = options

  const loading = ref(false)
  let loadingInstance: ReturnType<typeof NLoading.service> | null = null
  let autoCloseTimer: NodeJS.Timeout | null = null

  function show(options: LoadingOptions = {}) {
    if (loading.value)
      return

    loading.value = true
    loadingInstance = NLoading.service({
      ...defaultOptions,
      ...options,
    })

    if (autoClose) {
      autoCloseTimer = setTimeout(() => {
        hide()
      }, autoCloseDelay)
    }
  }

  function hide() {
    if (!loading.value)
      return

    loading.value = false

    if (loadingInstance) {
      loadingInstance.close()
      loadingInstance = null
    }

    if (autoCloseTimer) {
      clearTimeout(autoCloseTimer)
      autoCloseTimer = null
    }
  }

  const wrap = <T extends any[], R>(
    fn: (...args: T) => Promise<R>,
    options: LoadingOptions = {},
  ) => {
    return async (...args: T): Promise<R> => {
      show(options)
      try {
        return await fn(...args)
      }
      finally {
        hide()
      }
    }
  }

  return {
    loading,
    show,
    hide,
    wrap,
  }
}

/**
 * 创建全局 loading 的 composable
 */
export function useGlobalLoading() {
  return {
    service: NLoading.service,
    closeAll: NLoading.closeAll,
    getInstanceCount: NLoading.getInstanceCount,
  }
}
