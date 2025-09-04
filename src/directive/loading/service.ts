import type { LoadingOptions } from './types'
import { createLoadingMask, removeLoadingMask } from '.'

interface LoadingInstance {
  mask: HTMLDivElement
  options: LoadingOptions
  originalOverflow: string
  originalPosition: string
}

interface LoadingServiceInstance extends LoadingInstance {
  close: () => void
}

class LoadingService {
  private instances: Map<string, LoadingInstance> = new Map()
  private counter = 0

  /**
   * 创建 loading 实例
   */
  service(options: LoadingOptions = {}): LoadingServiceInstance {
    const id = `loading-${++this.counter}`

    // 设置默认选项
    const defaultOptions: LoadingOptions = {
      background: 'rgba(255, 255, 255, 0.7)',
      fullscreen: true,
      lock: true,
      ...options,
    }

    const mask = createLoadingMask(defaultOptions)

    // 挂载到 body
    document.body.appendChild(mask)

    // 锁定滚动
    let originalOverflow = ''
    if (defaultOptions.lock) {
      if (defaultOptions.fullscreen || !options.target) {
        originalOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'
      }
      else if (options.target && options.target instanceof HTMLElement) {
        const parent = options.target.parentElement
        if (parent) {
          originalOverflow = parent.style.overflow || ''
          parent.style.overflow = 'hidden'
        }
      }
    }

    const instance: LoadingInstance = {
      mask,
      options: defaultOptions,
      originalOverflow,
      originalPosition: '',
    }

    this.instances.set(id, instance)

    // 返回带有 close 方法的实例
    return {
      ...instance,
      close: () => this.close(id),
    }
  }

  /**
   * 关闭指定的 loading 实例
   */
  close(id: string): void {
    const instance = this.instances.get(id)
    if (instance) {
      removeLoadingMask(instance)
      this.instances.delete(id)
    }
  }

  /**
   * 关闭所有 loading 实例
   */
  closeAll(): void {
    this.instances.forEach((_instance, id) => {
      this.close(id)
    })
  }

  /**
   * 获取当前活跃的实例数量
   */
  getInstanceCount(): number {
    return this.instances.size
  }
}

// 创建全局实例
const loadingService = new LoadingService()

// 导出便捷方法
export const NLoading = {
  service: (options?: LoadingOptions) => loadingService.service(options),
  closeAll: () => loadingService.closeAll(),
  getInstanceCount: () => loadingService.getInstanceCount(),
}
