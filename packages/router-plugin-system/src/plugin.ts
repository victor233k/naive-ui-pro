import type { App } from 'vue'
import type { Router } from 'vue-router'

export type ProRouterPluginUninstallHandler = () => void
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
  onUninstall: (handler: ProRouterPluginUninstallHandler) => void
}

export interface ProRouterPlugin {
  /**
   * Called when the plugin is installed.
   */
  (ctx: ProRouterPluginContext): void
}