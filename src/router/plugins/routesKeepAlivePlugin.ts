import type { RouteRecordNameGeneric } from 'vue-router'
import type { Plugin } from '../composables/create-router'
import { isBoolean, isString } from 'lodash-es'
import { useRouteKeepAliveStore } from '@/store/use-route-keep-alive'

declare module 'vue-router' {
  interface RouteMeta {
    keepAlive?: boolean | {
      // 这些路由返回时，缓存当前页面
      cacheWhenBackFrom: string[]
    }
  }
}
export function routesKeepAlivePlugin(): Plugin {
  const store = useRouteKeepAliveStore()
  function add(name: RouteRecordNameGeneric) {
    if (isString(name))
      store.add(name)
  }
  function remove(name: RouteRecordNameGeneric) {
    if (isString(name))
      store.remove(name)
  }

  return {
    name: 'route-keep-alive',
    beforeEach(to, from) {
      if (!from.name)
        return
      const option = from.meta.keepAlive
      if (isBoolean(option)) {
        option ? add(from.name) : remove(from.name)
        return
      }
      if (option && Array.isArray(option.cacheWhenBackFrom)) {
        const shouldKeep = option.cacheWhenBackFrom
          .map(String)
          .includes(String(to.name))
        shouldKeep ? add(from.name) : remove(from.name)
        return
      }
      remove(from.name)
    },
  }
}
