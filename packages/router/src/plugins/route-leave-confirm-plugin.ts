import type { ProRouterPlugin } from '../plugin'
import { useEventListener } from '@vueuse/core'
import { isFunction, isString, isSymbol } from 'lodash-es'

declare module 'vue-router' {
  interface Router {
    /**
     * 启用当前页面的离开确认
     */
    enableLeaveConfirm: (message?: string | (() => Promise<boolean>)) => void
    /**
     * 临时禁用当前页面的离开确认
     * 调用后，当前页面离开时将不再提示确认
     */
    disableLeaveConfirm: () => void
  }
}

/**
 * 路由离开确认插件配置选项
 */
interface RouteLeaveConfirmPluginOptions {
  /** 默认确认消息 */
  defaultMessage?: string
}

// 页面状态管理
interface LeaveConfirmConfig {
  message?: string
  handler?: () => Promise<boolean>
}

let activeLeaveGuards: Map<string, LeaveConfirmConfig> = new Map()
let currentRouteName: string

/**
 * TODO: 要优化
 */
export function routeLeaveConfirmPlugin(options: RouteLeaveConfirmPluginOptions = {}): ProRouterPlugin {
  const {
    defaultMessage = '页面有未保存的更改，确定要离开吗？',
  } = options

  // 启用当前页面的离开确认
  function enableLeaveConfirm(messageOrHandler?: string | (() => Promise<boolean>)) {
    if (isString(messageOrHandler)) {
      activeLeaveGuards.set(currentRouteName, { message: messageOrHandler })
    }
    else if (isFunction(messageOrHandler)) {
      activeLeaveGuards.set(currentRouteName, { handler: messageOrHandler })
    }
    else {
      activeLeaveGuards.set(currentRouteName, { message: defaultMessage })
    }
  }

  // 禁用当前页面的离开确认
  function disableLeaveConfirm() {
    activeLeaveGuards.delete(currentRouteName)
  }

  // beforeunload 事件处理函数
  function handleBeforeUnload(event: BeforeUnloadEvent) {
    if (activeLeaveGuards.has(currentRouteName)) {
      const config = activeLeaveGuards.get(currentRouteName)
      const message = config?.message
      event.preventDefault()
      return message
    }
  }

  return ({ router }) => {
    // window.beforeunload
    useEventListener('beforeunload', handleBeforeUnload)

    router.beforeEach(async (_, from) => {
      if (!this.enableLeaveConfirm && !this.disableLeaveConfirm) {
        this.enableLeaveConfirm = enableLeaveConfirm.bind(this)
        this.disableLeaveConfirm = disableLeaveConfirm.bind(this)
      }
      const name = from.name && String(from.name)
      currentRouteName = name
      if (!name || !activeLeaveGuards.has(name)) {
        return true
      }
      const config = activeLeaveGuards.get(name)
      if (config?.handler) {
        try {
          const result = await config.handler()
          return !!result
        }
        catch {
          return false
        }
      }
      const message = config?.message
      return confirm(message)
    })

    router.afterEach((to, from, failure) => {
      // 跳转后移除 from 的 activeLeaveGuards，仅当跳转成功时
      if (failure === undefined && from && from.name) {
        activeLeaveGuards.delete(String(from.name))
      }
      currentRouteName = to.name ? String(to.name) : null
    })
  }
}
