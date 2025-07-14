import type { App, EffectScope } from 'vue'
import type { RouterOptions as _RouterOptions, Router } from 'vue-router'
import type { ProRouterObjectPlugin, ProRouterPlugin, ProRouterPluginRunWithAppHandler, ProRouterPluginUnmountHandler } from './plugin'
import { effectScope } from 'vue'
import { createRouter as _createRouter } from 'vue-router'
import { setupPlugin } from './plugin'
import { normalizeRoutesPlugin } from './plugins/normalize-routes-plugin'
import { ALREADY_INSTALLED, APP, EFFECT_SCOPE, RUN_WITH_APP_HANDLERS, UNMOUNT_HANDLERS } from './symbols'

export interface ProRouterOptions extends _RouterOptions {
  plugins?: ProRouterPlugin[]
}

export function createRouter(options: ProRouterOptions): Router {
  const { plugins = [], vrOptions } = resolveOptions(options)
  const router = _createRouter(vrOptions)
  const scope = (router[EFFECT_SCOPE] ??= effectScope(true))
  const { install, beforeEach, beforeResolve, afterEach, onError } = router

  router.install = (...args) => {
    const [app] = args
    prepareInstall(app, router)
    install.call(router, ...args)
    const runWithAppHandlers = (router[RUN_WITH_APP_HANDLERS] ??= [])
    runWithAppHandlers.forEach(handler => handler(app))
    runWithAppHandlers.length = 0
  }

  router.beforeEach = (guard, ...rest) => {
    return beforeEach((...args) => {
      return scope.run(() => {
        return guard.call(undefined, ...args)
      })
    }, ...rest)
  }

  router.beforeResolve = (guard, ...rest) => {
    return beforeResolve((...args) => {
      return scope.run(() => {
        return guard.call(undefined, ...args)
      })
    }, ...rest)
  }

  router.afterEach = (guard, ...rest) => {
    return afterEach((...args) => {
      return scope.run(() => {
        return guard.call(undefined, ...args)
      })
    }, ...rest)
  }

  router.onError = (handler, ...rest) => {
    return onError((...args) => {
      return scope.run(() => {
        return handler.call(undefined, ...args)
      })
    }, ...rest)
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

function resolveOptions(options: ProRouterOptions) {
  const { plugins = [], ...vueRouterOptions } = options

  const builtinPlugins = [
    normalizeRoutesPlugin(),
  ]

  const objectPlugins = [
    ...builtinPlugins,
    ...plugins,
  ].map(convertToObjectPlugin)

  const finalVrOptions = objectPlugins.reduce((p, c) => {
    if (c.resolveOptions) {
      return c.resolveOptions(p)
    }
    return p
  }, vueRouterOptions)

  return {
    plugins: objectPlugins,
    vrOptions: finalVrOptions,
  }
}

function convertToObjectPlugin(plugin: ProRouterPlugin): ProRouterObjectPlugin {
  if (typeof plugin === 'function') {
    return {
      install: plugin,
    }
  }
  return plugin
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
