import type { Router, RouterOptions } from 'vue-router'
import { createRouter as _createRouter } from 'vue-router'

type ProRouterPluginName
// builtin plugin
= | `@pro/router-plugin-${string}`
// external plugin
  | `pro-router-plugin-${string}`

export interface ProRouterPlugin {
  /**
   * 插件名称
   */
  name: ProRouterPluginName
  /**
   * 可以修改传递给 `createRouter` 的配置
   */
  config?: (options: RouterOptions) => RouterOptions
  /**
   * 传递给 `createRouter` 的配置完成后调用的钩子
   */
  configResolved?: (options: RouterOptions) => void
  /**
   * 路由错误处理函数,等同于 `router.onError`
   */
  onError?: (this: Router, ...args: Parameters<Router['onError']>) => void
  /**
   * 路由守卫,等同于 `router.afterEach`
   */
  afterEach?: (this: Router, guard: Parameters<Router['afterEach']>[0]) => void
  /**
   * 路由守卫,等同于 `router.beforeEach`
   */
  beforeEach?: (this: Router, ...args: Parameters<Router['beforeEach']>) => void
  /**
   * 路由解析前钩子,等同于 `router.beforeResolve`
   */
  beforeResolve?: (this: Router, ...args: Parameters<Router['beforeResolve']>) => void
}

export interface ProRouterOptions extends RouterOptions {
  plugins?: ProRouterPlugin[]
}

const installedPluginNames = new Set<string>()

export function createRouter(options: ProRouterOptions): Router {
  let {
    plugins = [],
    ...routerOptions
  } = options

  for (let i = 0; i < plugins.length; i++) {
    const plugin = plugins[i]
    plugin.config && (routerOptions = plugin.config(routerOptions))
  }
  for (let i = 0; i < plugins.length; i++) {
    const plugin = plugins[i]
    plugin.configResolved && plugin.configResolved(routerOptions)
  }
  const router = _createRouter(routerOptions)
  for (let i = 0; i < plugins.length; i++) {
    const {
      name,
      onError,
      afterEach,
      beforeEach,
      beforeResolve,
    } = plugins[i]
    if (installedPluginNames.has(name)) {
      if (__DEV__) {
        console.warn(`[@pro/router] 插件 "${name}" 被重复注册`)
      }
    }
    onError && router.onError((...args) => {
      onError.call(router, ...args)
    })
    afterEach && router.afterEach((...args) => {
      afterEach.call(router, ...args)
    })
    beforeEach && router.beforeEach((...args) => {
      beforeEach.call(router, ...args)
    })
    beforeResolve && router.beforeResolve((...args) => {
      beforeResolve.call(router, ...args)
    })
    installedPluginNames.add(name)
    console.info(`[@pro/router] ✅ 插件 "${name}" 已注册`)
  }
  return router
}
