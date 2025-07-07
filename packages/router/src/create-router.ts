import type { App, EffectScope } from 'vue'
import type { RouterOptions as _RouterOptions, Router } from 'vue-router'
import type { ProRouterPlugin, ProRouterPluginRunWithAppHandler, ProRouterPluginUnmountHandler } from './plugin'
import { createRouter as _createRouter } from 'vue-router'
import { setupPlugin } from './plugin'
import { ALREADY_INSTALLED, APP, EFFECT_SCOPE, RUN_WITH_APP_HANDLERS, UNMOUNT_HANDLERS } from './symbols'

export interface ProRouterOptions extends _RouterOptions {
  plugins?: ProRouterPlugin[]
}

export function createRouter(options: ProRouterOptions): Router {
  const { plugins = [], ...vueRouterOptions } = options
  const router = _createRouter(vueRouterOptions)
  const { install } = router

  router.install = (...args) => {
    const [app] = args
    prepareInstall(app, router)
    install.apply(router, args)
    const runWithAppHandlers = (router[RUN_WITH_APP_HANDLERS] ??= [])
    runWithAppHandlers.forEach(handler => handler(app))
    runWithAppHandlers.length = 0
  }

  plugins.forEach((plugin) => {
    setupPlugin({ router, plugin })
  })
  return router
}

function prepareInstall(app: App, router: Router) {
  if (router[ALREADY_INSTALLED]) {
    return
  }
  router[APP] = app
  router[ALREADY_INSTALLED] = true

  app.onUnmount(() => {
    router[EFFECT_SCOPE]?.stop()
    router[UNMOUNT_HANDLERS]?.forEach(handler => handler())

    delete router[APP]
    delete router[EFFECT_SCOPE]
    delete router[UNMOUNT_HANDLERS]
    delete router[ALREADY_INSTALLED]
    delete router[RUN_WITH_APP_HANDLERS]
  })
}

declare module 'vue-router' {
  export interface Router {
    /**
     * vue instance
     */
    [APP]?: App
    /**
     * The vue effect scope.
     */
    [EFFECT_SCOPE]?: EffectScope
    /**
     * The router plugin uninstall functions.
     */
    [UNMOUNT_HANDLERS]?: ProRouterPluginUnmountHandler[]
    /**
     * The router plugin run with app functions.
     */
    [RUN_WITH_APP_HANDLERS]?: ProRouterPluginRunWithAppHandler[]
    /**
     * The flag to indicate whether the router is prepared.
     */
    [ALREADY_INSTALLED]?: boolean
  }
}
