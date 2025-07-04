import type { RouteRecordNameGeneric } from 'vue-router'
import type { ProRouterPlugin } from '../create-router'
import { isBoolean, isSymbol } from 'lodash-es'

declare module 'vue-router' {
  interface RouteMeta {
    keepAlive?: boolean | {
      // 这些路由返回时，不缓存当前页面
      exclude: (string | symbol)[]
    }
  }
}

type KeepAliveStoreLike = () => ({
  /**
   * 添加一个缓存 name
   * @param name 路由名称（必须为字符串）
   */
  add: (name: string | RegExp) => void
  /**
   * 缓存列表中移除指定的路由 name
   * @param name 路由名称（必须为字符串）
   */
  remove: (name: string | RegExp) => void
}
)
interface KeepAlivePluginOptions {
  store: KeepAliveStoreLike
  /**
   * @default false
   */
  defualtKeepAlive?: boolean
}

function normalizeRouteName(name: RouteRecordNameGeneric): string {
  return isSymbol(name) ? (new RegExp(name.toString())).toString() : name.toString()
}

/**
 * TODO: 要重构
 */
export function keepAlivePlugin({
  store,
  defualtKeepAlive = false,
}: KeepAlivePluginOptions): ProRouterPlugin {
  return {
    name: '@pro/router-plugin-keep-alive',
    beforeEach(to, from) {
      if (!from.name) {
        return
      }
      const { add, remove } = store()
      const { keepAlive = defualtKeepAlive } = from.meta
      const normalizedName = normalizeRouteName(from.name)
      if (isBoolean(keepAlive)) {
        keepAlive ? add(normalizedName) : remove(normalizedName)
        return
      }
      if (
        keepAlive.exclude
          .map(normalizeRouteName)
          .includes(normalizeRouteName(to.name))
      ) {
        remove(normalizedName)
        return
      }
      add(normalizedName)
    },
  }
}
