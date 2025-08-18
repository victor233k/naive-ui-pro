import type { RouteLocationNormalizedGeneric } from 'vue-router'
import type { ProRouterPlugin } from '../plugin'
import { useTitle } from '@vueuse/core'
import { ref } from 'vue'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
  }
}

interface DocumentTitlePluginOptions {
  resolveTitle?: (route: RouteLocationNormalizedGeneric) => string
}

export function documentTitlePlugin({
  resolveTitle = r => r.meta.title,
}: DocumentTitlePluginOptions = {}): ProRouterPlugin {
  return ({ router }) => {
    const ready = ref(false)
    router.isReady().then(() => {
      ready.value = true
    })
    useTitle(() => {
      return ready.value
        ? resolveTitle(router.currentRoute.value)
        : null
    })
  }
}
