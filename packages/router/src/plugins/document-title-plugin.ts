import type { NavigationFailure, RouteLocationNormalized } from 'vue-router'
import type { ProRouterPlugin } from '../plugin'
import { useTitle } from '@vueuse/core'
import { isString } from 'lodash-es'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
  }
}

interface DocumentTitlePluginOptions {
  titleTemplate:
    | string
    | ((to: RouteLocationNormalized, from: RouteLocationNormalized, failure?: NavigationFailure | void) => string)
}

export function documentTitlePlugin({ titleTemplate }: DocumentTitlePluginOptions): ProRouterPlugin {
  return ({ router }) => {
    router.afterEach((to, from, failure) => {
      useTitle(to.meta.title, {
        titleTemplate: () => {
          return isString(titleTemplate) ? titleTemplate : titleTemplate(to, from, failure)
        },
      })
    })
  }
}
