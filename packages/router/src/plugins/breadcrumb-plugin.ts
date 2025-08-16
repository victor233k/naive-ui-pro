import type { RouteLocationMatched } from 'vue-router'
import type { ProRouterPlugin } from '../plugin'
import { computed } from 'vue'

declare module 'vue-router' {
  interface RouteMeta {
    /**
     * 面包屑标题
     */
    title?: string
    /**
     * 面包屑图标
     */
    icon?: string
    /**
     * 是否不在面包屑中显示
     * @default false
     */
    hideInBreadcrumb?: boolean
  }

  interface Router {
    /**
     * 根据路由数据构建面包屑数据
     */
    buildBreadcrumbs: () => BreadcrumbItem[]
  }
}

interface BreadcrumbItem {
  path: string
  title: string
  icon?: string
}

interface BreadcrumbPluginOptions {
  resolveBreadcrumb?: (item: BreadcrumbItem, matchedRoute: RouteLocationMatched) => BreadcrumbItem
}

export function breadcrumbPlugin({
  resolveBreadcrumb,
}: BreadcrumbPluginOptions = {}): ProRouterPlugin {
  return ({ router, onUnmount }) => {
    const breadcrumbs = computed(() => {
      const breadcrumbs: BreadcrumbItem[] = []
      router.currentRoute.value.matched.forEach((matchedRoute) => {
        const {
          icon,
          title,
          hideInBreadcrumb,
        } = matchedRoute.meta ?? {}
        if (title && !hideInBreadcrumb) {
          const item: BreadcrumbItem = {
            icon,
            title,
            path: matchedRoute.path,
          }
          breadcrumbs.push(
            resolveBreadcrumb
              ? resolveBreadcrumb(item, matchedRoute)
              : item,
          )
        }
      })
      return breadcrumbs
    })

    router.buildBreadcrumbs = () => {
      return breadcrumbs.value
    }

    onUnmount(() => {
      delete router.buildBreadcrumbs
    })
  }
}
