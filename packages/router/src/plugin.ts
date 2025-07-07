import type { App } from 'vue'
import type { Router } from 'vue-router'
import { effectScope } from 'vue'
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

export interface ProRouterPlugin {
  /**
   * Called when the plugin is installed.
   */
  (ctx: ProRouterPluginContext): void
}

export function setupPlugin({
  router,
  plugin,
}: {
  router: Router
  plugin: ProRouterPlugin
}) {
  const scope = (router[EFFECT_SCOPE] ??= effectScope(true))
  scope.run(() => {
    plugin({
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
