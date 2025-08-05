import type { ProRouterPlugin } from '@pro/router'
import { useLayoutStore } from '@/store/use-layout-store'

declare module 'vue-router' {
  interface RouteMeta {
    /**
     * 是否显示布局
     */
    layout?: boolean
  }
}

/**
 * 这个插件与 admin 强关联，所以不放在 @pro/router 中
 */
export function layoutFalsyPlugin(): ProRouterPlugin {
  return ({ router }) => {
    router.afterEach((to) => {
      const layoutStore = useLayoutStore()
      if (
        to.meta?.layout === false
        && layoutStore.mode !== 'full-content'
      ) {
        layoutStore.mode = 'full-content'
      }
    })
  }
}
