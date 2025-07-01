import type { RouteRecordRaw } from 'vue-router'
import type { Plugin } from '../create-router'
import { isString } from 'lodash-es'

declare module 'vue-router' {
  interface RouteMeta {
    /**
     * 离开页面时提示确认
     * - true：使用默认提示
     * - string：自定义提示内容
     */
    leaveConfirm?: boolean | string
  }
}

export interface leaveConfirmStoreLike {
  init: (routeNames: string[]) => void
  has: (routeName: string) => boolean
}

function extractConfirmRouteNames(routes: RouteRecordRaw[]): string[] {
  const result: string[] = []

  function traverse(routes: RouteRecordRaw[]) {
    for (const route of routes) {
      if (
        route.meta?.leaveConfirm === true
        || typeof route.meta?.leaveConfirm === 'string'
      ) {
        if (route.name && typeof route.name === 'string')
          result.push(route.name)
      }
      if (route.children)
        traverse(route.children)
    }
  }

  traverse(routes)
  return result
}

export function routeLeaveConfirmPlugin(store: leaveConfirmStoreLike, routes: RouteRecordRaw[]): Plugin {
  const initialConfirmNames = extractConfirmRouteNames(routes)
  store.init(initialConfirmNames)

  return {
    name: 'route-leave-confirm',

    beforeEach(_, from) {
      const routeName = from.name?.toString()
      if (!routeName)
        return true

      const meta = from.meta
      const needConfirm = store.has(routeName)

      if (!needConfirm)
        return true

      const message = isString(meta.leaveConfirm)
        ? meta.leaveConfirm
        : '您有未保存的信息，确认要离开此页面吗？'

      return window.confirm(message)
    },
  }
}
