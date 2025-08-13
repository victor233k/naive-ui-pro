import type { MenuOption } from 'naive-ui'
import type { Merge } from 'type-fest'
import type { VNodeChild } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import type { ProRouterPlugin } from '../plugin'
import { Icon } from '@iconify/vue'
import { isNil } from 'lodash-es'
import { mapTree } from 'pro-composables'
import { computed, h } from 'vue'
import { normalizeRouteName } from '../utils/normalize-route-name'

declare module 'vue-router' {
  interface RouteMeta {
    /**
     * 菜单标题
     */
    title?: string
    /**
     * 菜单图标
     */
    icon?: string
    /**
     * 是否不在菜单中显示
     * @default false
     */
    hideInMenu?: boolean
    /**
     * 菜单排序，越小越靠前
     */
    order?: number
  }

  interface Router {
    /**
     * 根据路由数据构建菜单
     */
    buildMenus: () => MenuOption[]
  }
}

interface NMenuPluginOptions {
  service: () => {
    resolveIcon?: (icon: string) => VNodeChild
    routes: Merge<RouteRecordRaw, { component?: any, children?: any[] }>[]
  }
}

export function nMenuPlugin({ service }: NMenuPluginOptions): ProRouterPlugin {
  return ({ router, onUnmount }) => {
    router.beforeResolve(() => {
      if (!router.buildMenus) {
        const finalMenus = computed(() => {
          const { routes, resolveIcon } = service()
          const routeNameToPathMap = router
            .getRoutes()
            .reduce<Map<string, string>>((p, { name, path }) => {
              p.set(normalizeRouteName(name), path)
              return p
            }, new Map())

          return mapTree(sortRoutesByMetaOrder([...routes]), ({
            name,
            meta,
            children = [],
          }) => {
            const {
              icon,
              title,
              hideInMenu = false,
            } = meta ?? {}
            const normalizedName = normalizeRouteName(name)
            const menuKey = routeNameToPathMap.get(normalizedName)
            const showMenu = !hideInMenu && !isNil(menuKey)
            const menu: MenuOption = {
              key: menuKey,
              show: showMenu,
              label: title ?? normalizedName,
            }
            if (icon) {
              menu.icon = () => {
                return resolveIcon
                  ? resolveIcon(icon)
                  : builtinResolveIcon(icon)
              }
            }
            if (children.filter(item => !item.meta?.hideInMenu).length > 0) {
              menu.children = sortRoutesByMetaOrder(children) as any
            }
            return menu
          }, 'children')
        })

        router.buildMenus = () => {
          return finalMenus.value
        }

        onUnmount(() => {
          delete router.buildMenus
        })
      }
    })
  }
}

function builtinResolveIcon(icon: string) {
  return h(Icon, {
    icon,
    width: 18,
    height: 18,
  })
}

function sortRoutesByMetaOrder(routes: Omit<RouteRecordRaw, 'component'>[]) {
  return routes.sort((a, b) => {
    return (a.meta?.order ?? Number.MAX_SAFE_INTEGER) - (b.meta?.order ?? Number.MAX_SAFE_INTEGER)
  })
}
