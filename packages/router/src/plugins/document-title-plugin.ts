import type { NavigationFailure, RouteLocationNormalized } from 'vue-router'
import type { ProRouterPlugin } from '../plugin'
import { useTitle } from '@vueuse/core'
import { isSymbol } from 'lodash-es'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
  }
}

interface DocumentTitlePluginOptions {
  titleTemplate?: ((to: RouteLocationNormalized, from: RouteLocationNormalized, failure?: NavigationFailure | void) => string)
}

export function documentTitlePlugin({ titleTemplate }: DocumentTitlePluginOptions = {}): ProRouterPlugin {
  return ({ router }) => {
    router.afterEach((to, from, failure) => {
      const title = to.meta.title ?? (isSymbol(to.name) ? to.name.toString() : to.name)
      useTitle(title, {
        titleTemplate: () => {
          return titleTemplate
            ? titleTemplate(to, from, failure)
            : title
        },
      })
    })
  }
}
