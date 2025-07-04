import type { NavigationFailure, RouteLocationNormalized } from 'vue-router'
import type { ProRouterPlugin } from '../create-router'
import { useTitle } from '@vueuse/core'
import { isString } from 'lodash-es'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
  }
}

interface DocumentTitlePluginOptions {
  template:
    | string
    | ((to: RouteLocationNormalized, from: RouteLocationNormalized, failure?: NavigationFailure | void) => string)
}

export function documentTitlePlugin({ template }: DocumentTitlePluginOptions): ProRouterPlugin {
  return {
    name: '@pro/router-plugin-document-title',
    afterEach(to, from, failure) {
      useTitle(to.meta.title, {
        titleTemplate: () => {
          return isString(template) ? template : template(to, from, failure)
        },
      })
    },
  }
}
