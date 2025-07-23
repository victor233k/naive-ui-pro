import type { RouteRecordNameGeneric } from 'vue-router'
import type { ProRouterPlugin } from '../plugin'
import { isSymbol } from 'lodash-es'
import NProgress from 'nprogress'
import { ref } from 'vue'
import 'nprogress/nprogress.css'

interface RouteKeyInfo {
  baseKey: string
  timestamp?: number
}

declare module 'vue-router' {
  interface RouteMeta {
    /**
     * 是否用 fullPath 作为 keep-alive key
     */
    useFullPathAsKey?: boolean
  }

  interface Router {
    /**
     * 获取路由的key
     */
    getRouteKey: () => string
    /**
     * 刷新当前路由页面
     */
    refresh: (routeName?: string) => Promise<void>
  }
}

function normalizeRouteName(name: RouteRecordNameGeneric): string {
  if (!name) {
    return ''
  }
  if (isSymbol(name)) {
    return new RegExp(String(name)).toString()
  }
  return String(name)
}

export function refreshPlugin(): ProRouterPlugin {
  return ({ router, onUnmount }) => {
    const routeKeyMap = ref(new Map<string, RouteKeyInfo>())

    router.getRouteKey = () => {
      const { currentRoute } = router
      const info = routeKeyMap.value.get(normalizeRouteName(currentRoute.value.name))
      return info.timestamp ? `${info.baseKey}?t=${info.timestamp}` : info.baseKey
    }

    router.refresh = async (routeName?: string) => {
      const normalizedName = normalizeRouteName(routeName ?? router.currentRoute.value.name)
      const info = routeKeyMap.value.get(normalizedName)
      routeKeyMap.value.set(normalizedName, { ...info, timestamp: Date.now() })

      NProgress.start()
      NProgress.done()
    }

    router.afterEach((to, _, failure) => {
      if (failure) {
        return
      }
      const normalizedName = normalizeRouteName(to.name)
      const baseKey = to.meta.useFullPathAsKey ? to.fullPath : to.path

      routeKeyMap.value.set(normalizedName, {
        ...(routeKeyMap.value.get(normalizedName) ?? {}),
        baseKey,
      })
    })

    onUnmount(() => {
      delete router.refresh
      delete router.getRouteKey
    })
  }
}
