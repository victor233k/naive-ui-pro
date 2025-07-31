import type { App } from 'vue'
import type { Router, RouterOptions } from 'vue-router'
import { APP, EFFECT_SCOPE, RUN_WITH_APP_HANDLERS, UNMOUNT_HANDLERS } from './symbols'

export type ProRouterPluginCleanupHandler = () => void
export type ProRouterPluginUnmountHandler = () => void
export type ProRouterPluginRunWithAppHandler = (app: App) => void

export interface ProRouterPluginContext {
  /**
   * 路由实例
   */
  router: Router
  /**
   * 运行一个函数，router.install 时调用，会有 vue 实例参数
   */
  runWithApp: (handler: ProRouterPluginRunWithAppHandler) => void
  /**
   * 注册一个函数，当 vue 实例被卸载时调用
   */
  onUnmount: (handler: ProRouterPluginUnmountHandler) => void
}

export interface ProRouterObjectPlugin {
  /**
   * 插件安装函数
   */
  install?: (ctx: ProRouterPluginContext) => void | ProRouterPluginReturned
  /**
   * 插件执行前，可以对 options 进行修改
   */
  resolveOptions?: (options: RouterOptions) => RouterOptions
}

export interface ProRouterPluginReturned {
  /**
   * 清理函数钩子，当用户执行 router.runPluginsCleanup 时调用
   */
  onCleanup?: () => void
}

export interface ProRouterFunctionPlugin {
  /**
   * 插件安装函数
   */
  (ctx: ProRouterPluginContext): void | ProRouterPluginReturned
  /**
   * 插件执行前，可以对 options 进行修改
   */
  resolveOptions?: (options: RouterOptions) => RouterOptions
}

export type ProRouterPlugin = ProRouterObjectPlugin | ProRouterFunctionPlugin

export function setupPlugin({
  router,
  plugin,
}: {
  router: Router
  plugin: ProRouterObjectPlugin
}) {
  router[EFFECT_SCOPE].run(() => {
    plugin.install({
      router,
      onUnmount(handler) {
        const handlers = (router[UNMOUNT_HANDLERS] ??= [])
        handlers.push(handler)
      },
      runWithApp(handler) {
        if (router[APP]) {
          handler(router[APP])
          return
        }
        const handlers = (router[RUN_WITH_APP_HANDLERS] ??= [])
        handlers.push(handler)
      },
    })
  })
}
