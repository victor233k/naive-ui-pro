import type { RouteLocationNormalizedGeneric } from 'vue-router'
import type { ProRouterPlugin } from '../plugin'
import { useTitle } from '@vueuse/core'
import { ref } from 'vue'
import { normalizeRouteName } from '../utils/normalize-route-name'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
  }
}

interface DocumentTitlePluginOptions {
  resolveTitle?: (route: RouteLocationNormalizedGeneric) => string
}

export function documentTitlePlugin({
  resolveTitle = r => r.meta.title ?? normalizeRouteName(r.name),
}: DocumentTitlePluginOptions = {}): ProRouterPlugin {
  return ({ router }) => {
    const shouldShowTitle = ref(false)
    router.isReady().then(() => {
      shouldShowTitle.value = true
    })

    useTitle(() => shouldShowTitle.value ? resolveTitle(router.currentRoute.value) : null)
  }
}
