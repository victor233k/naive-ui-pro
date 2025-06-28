import type { RouteRecordNameGeneric, RouteRecordRaw } from 'vue-router'
import type { Plugin } from '../composables/create-router'
import { isBoolean, isString } from 'lodash-es'

function extractKeepAliveNames(routes: readonly RouteRecordRaw[]): string[] {
  const result: string[] = []

  const traverse = (routes: readonly RouteRecordRaw[]) => {
    for (const route of routes) {
      if (route.meta?.keepAlive) {
        if (typeof route.name === 'string') {
          result.push(route.name)
        }
      }
      if (route.children?.length) {
        traverse(route.children)
      }
    }
  }

  traverse(routes)
  return result
}

declare module 'vue-router' {
  interface RouteMeta {
    keepAlive?: boolean | {
      // 这些路由返回时，不缓存当前页面
      noCacheWhenBackFrom: string[]
    }
  }
}

export interface KeepAliveStoreLike {
  /**
   * 初始化缓存列表
   * @param keepAlive 路由 name 组成的缓存列表
   */
  init: (keepAlive: string[]) => void
  /**
   * 添加一个缓存 name
   * @param name 路由名称（必须为字符串）
   */
  add: (name: string) => void
  /**
   * 缓存列表中移除指定的路由 name
   * @param name 路由名称（必须为字符串）
   */
  remove: (name: string) => void
}

export function routesKeepAlivePlugin(store: KeepAliveStoreLike, routes: RouteRecordRaw[]): Plugin {
  // 插件初始化阶段，提取全部默认需要缓存的 name
  const defaultKeepAliveNames = extractKeepAliveNames(routes)
  store.init(defaultKeepAliveNames)
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
      const config = from.meta.keepAlive
      if (isBoolean(config)) {
        config ? add(from.name) : remove(from.name)
        return
      }
      if (config?.noCacheWhenBackFrom) {
        const noShouldKeep = config.noCacheWhenBackFrom
          .map(String)
          .includes(String(to.name))
        noShouldKeep ? remove(from.name) : add(from.name)
        return
      }
      remove(from.name)
    },
  }
}
