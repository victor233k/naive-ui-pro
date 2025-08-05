import type { ProRouterPlugin } from '../plugin'
import { computed } from 'vue'
import { normalizeRouteName } from '../utils/normalize-route-name'

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

export function breadcrumbPlugin(): ProRouterPlugin {
  return ({ router, onUnmount }) => {
    router.afterEach(() => {
      if (!router.buildBreadcrumbs) {
        const breadcrumbs = computed(() => {
          const breadcrumbs: BreadcrumbItem[] = []
          router.currentRoute.value.matched.forEach(({ meta, path, name }) => {
            const { title, icon, hideInBreadcrumb } = meta ?? {}
            if (title && !hideInBreadcrumb) {
              breadcrumbs.push({
                path,
                icon,
                title: title ?? normalizeRouteName(name),
              })
            }
          })
          return breadcrumbs
        })

        router.buildBreadcrumbs = () => {
          return breadcrumbs.value
        }
      }
    })

    onUnmount(() => {
      delete router.buildBreadcrumbs
    })
  }
}
