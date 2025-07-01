import type { RouterOptions as _RouterOptions, Router } from 'vue-router'
import { isFunction } from 'lodash-es'
import { createRouter as _createRouter } from 'vue-router'

export interface Plugin {
  name: string
  onError?: Parameters<Router['onError']>[0]
  afterEach?: Parameters<Router['afterEach']>[0]
  beforeEach?: Parameters<Router['beforeEach']>[0]
}

type RouterPlugin = Plugin | ((router: Router) => Plugin)

export interface RouterOptions extends _RouterOptions {
  plugins?: RouterPlugin[]
}

export function createRouter(options: RouterOptions): Router {
  const { plugins = [], ...routerOptions } = options
  const router = _createRouter(routerOptions)
  plugins.forEach((plugin, idx) => {
    try {
      const resolvedPlugin = isFunction(plugin) ? plugin(router) : plugin
      const { name, beforeEach, afterEach, onError } = resolvedPlugin
      beforeEach && router.beforeEach(beforeEach)
      afterEach && router.afterEach(afterEach)
      onError && router.onError(onError)
      console.info(`[@pro/router] ✅ 插件 "${name}" 已加载`)
    }
    catch (err) {
      if (__DEV__) {
        const pluginName = (isFunction(plugin) ? plugin.name : plugin?.name) ?? `[Plugin#${idx}]`
        console.error(`[@pro/router] 插件 "${pluginName}" 错误:`, err)
      }
    }
  })

  return router
}
