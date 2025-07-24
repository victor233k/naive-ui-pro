import type { NavigationFailure, RouteLocationNormalized } from 'vue-router'
import type { ProRouterPlugin } from '../plugin'
import { useTitle } from '@vueuse/core'
import { normalizeRouteName } from '../utils/normalize-route-name'

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
      if (failure) {
        return
      }
      const title = to.meta.title ?? normalizeRouteName(to.name)
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
