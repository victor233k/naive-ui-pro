import type { App } from 'vue'
import type { Router, RouterOptions } from 'vue-router'
import { APP, EFFECT_SCOPE, RUN_WITH_APP_HANDLERS, UNMOUNT_HANDLERS } from './symbols'

export type ProRouterPluginUnmountHandler = () => void
export type ProRouterPluginRunWithAppHandler = (app: App) => void

export interface ProRouterPluginContext {
  /**
   * The router instance.
   */
  router: Router
  /**
   * Runs a function with the vue app.
   */
  runWithApp: (handler: ProRouterPluginRunWithAppHandler) => void
  /**
   * Register a function to be called when the plugin is uninstalled.
   */
  onUnmount: (handler: ProRouterPluginUnmountHandler) => void
}

export interface ProRouterObjectPlugin {
  install?: (ctx: ProRouterPluginContext) => void
  resolveOptions?: (options: RouterOptions) => RouterOptions
}

export interface ProRouterFunctionPlugin {
/**
 * Called when the plugin is installed.
 */
  (ctx: ProRouterPluginContext): void
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
