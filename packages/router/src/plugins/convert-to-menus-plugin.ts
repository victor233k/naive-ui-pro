import type { RouteRecordRaw } from 'vue-router'
import type { Plugin } from '../create-router'
import type { MenuItem } from '@/store/use-menu'
import { cloneDeep, isArray } from 'lodash-es'

declare module 'vue-router' {
  interface RouteMeta {
    title: string
    icon?: string
    hideInMenu?: boolean
    hideChildrenInMenu?: boolean
    link?: string
  }
}

export interface MenuStoreLike {
  initMenus: (menus: MenuItem[]) => void
}

// 拼接 path 辅助函数
function resolveFullPath(path: string, parentPath = ''): string {
  return `${parentPath}/${path}`.replace(/\/+/g, '/').replace(/\/$/, '')
}

function transformRoutesToMenus(routes: RouteRecordRaw[], parentPath = ''): MenuItem[] {
  return routes
    .filter(route => route.meta?.title && !route.meta?.hideInMenu)
    .map((route) => {
      const fullPath = resolveFullPath(route.path, parentPath)
      const {
        title = '',
        icon,
        link,
        hideChildrenInMenu,
      } = route.meta || {}

      const item: MenuItem = {
        title,
        icon,
        path: link || fullPath,
        name: route.name as string,
      }

      if (isArray(route.children) && !hideChildrenInMenu) {
        const children = transformRoutesToMenus(route.children, fullPath)
        if (children.length)
          item.children = children
      }

      return item
    })
}

export function convertToMenusPlugin(store: MenuStoreLike, routes: RouteRecordRaw[]): Plugin {
  console.log(routes, 'routes')
  const menus = transformRoutesToMenus(cloneDeep(routes))
  store.initMenus(menus)

  return {
    name: 'routes-to-menus',
  }
}
