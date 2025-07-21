import type { Ref } from 'vue'
import type { Router, RouteRecordNameGeneric } from 'vue-router'
import type { ProRouterPlugin } from '../plugin'
import { isBoolean, isSymbol } from 'lodash-es'
import { ref } from 'vue'

declare module 'vue-router' {
  interface RouteMeta {
    /**
     * 路由缓存配置
     * - true: 缓存当前路由
     * - false: 不缓存当前路由
     * - object: 配置特定情况下的缓存行为
     */
    keepAlive?: boolean | {
      /**
       * 当导航到这些路由时，不缓存当前页面
       */
      exclude: (string | symbol)[]
    }
  }

  interface Router {
    keepAliveList: Ref<(string | RegExp)[]>
  }
}

interface KeepAlivePluginOptions {
  /**
   * @default false
   */
  defaultKeepAlive?: boolean
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

function add(router: Router, name: string) {
  if (!router.keepAliveList.value.includes(name)) {
    router.keepAliveList.value.push(name)
  }
}

function remove(router: Router, name: string): void {
  router.keepAliveList.value = router.keepAliveList.value.filter(item => item !== name)
}

export function keepAlivePlugin({
  defaultKeepAlive = false,
}: KeepAlivePluginOptions = {}): ProRouterPlugin {
  return ({ router, onUnmount }) => {
    if (!router.keepAliveList) {
      router.keepAliveList = ref([])
    }

    router.afterEach((to, from) => {
      if (!from.name) {
        return
      }

      const { keepAlive = defaultKeepAlive } = from.meta
      const normalizedName = normalizeRouteName(from.name)
      if (isBoolean(keepAlive)) {
        keepAlive
          ? add(router, normalizedName)
          : remove(router, normalizedName)
        return
      }

      // 处理对象类型的keepAlive配置
      const isExcluded = keepAlive.exclude
        .map(normalizeRouteName)
        .includes(normalizeRouteName(to.name))

      isExcluded
        ? remove(router, normalizedName)
        : add(router, normalizedName)
    })

    onUnmount(() => {
      delete router.keepAliveList
    })
  }
}
