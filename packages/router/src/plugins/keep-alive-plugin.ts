import type { Ref } from 'vue'
import type { RouteLocationNormalizedGeneric } from 'vue-router'
import type { ProRouterPlugin } from '../plugin'
import { isBoolean } from 'lodash-es'
import { ref } from 'vue'
import { getRouteComponentName } from '../utils/route'

type MetaKeepAlive = boolean | {
  exclude?: string[]
  include?: string[]
}

declare module 'vue-router' {
  interface RouteMeta {
    /**
     * 路由缓存配置
     * - true: 缓存当前路由
     * - false: 不缓存当前路由
     * - object.include: 当导航到这些路由时，缓存当前页面，填写 route.name，无需和组件名称一致
     * - object.exclude: 当导航到这些路由时，不缓存当前页面，填写 route.name，无需和组件名称一致
     */
    keepAlive?: MetaKeepAlive
  }

  interface Router {
    /**
     * 缓存的组件名称列表，给 keep-alive 组件使用
     */
    cachedComponentNames: Ref<string[]>
  }
}

interface KeepAlivePluginOptions {
  /**
   * 默认是否缓存
   * @default false
   */
  defaultKeepAlive?: boolean
}

export function keepAlivePlugin({
  defaultKeepAlive = false,
}: KeepAlivePluginOptions = {}): ProRouterPlugin {
  return ({ router, onUnmount }) => {
    const cachedComponentNames = router.cachedComponentNames = ref<string[]>([])

    router.beforeEach((to, from) => {
      const fromName = getRouteComponentName(from)
      if (!fromName) {
        return
      }
      if (matched(to, from, defaultKeepAlive)) {
        if (!cachedComponentNames.value.includes(fromName)) {
          cachedComponentNames.value.push(fromName)
        }
      }
      else {
        if (cachedComponentNames.value.includes(fromName)) {
          cachedComponentNames.value = cachedComponentNames.value.filter(name => name !== fromName)
        }
      }
    })

    onUnmount(() => {
      delete router.cachedComponentNames
    })
  }
}

function matched(
  to: RouteLocationNormalizedGeneric,
  from: RouteLocationNormalizedGeneric,
  defaultKeepAlive: boolean,
) {
  const keepAlive = from.meta?.keepAlive ?? defaultKeepAlive
  if (isBoolean(keepAlive)) {
    return keepAlive
  }
  const exclude = keepAlive.exclude ?? []
  if (to.name && exclude.includes(to.name as any)) {
    return false
  }
  const include = keepAlive.include ?? []
  if (to.name && include.includes(to.name as any)) {
    return true
  }
  return false
}
