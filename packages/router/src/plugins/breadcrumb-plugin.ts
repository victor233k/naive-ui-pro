import type { ShallowRef } from 'vue'
import type { ProRouterPlugin } from '../plugin'
import { shallowReadonly, shallowRef } from 'vue'

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
     * 面包屑图标颜色
     */
    iconColor?: string
    /**
     * 是否不在面包屑中显示
     * @default false
     */
    hideInBreadcrumb?: boolean
  }

  interface Router {
    /**
     * 面包屑数据
     */
    breadcrumbs: Readonly<ShallowRef<BreadcrumbItem[]>>
  }
}

interface BreadcrumbItem {
  path: string
  title: string
  icon?: string
  iconColor?: string
}

export function breadcrumbPlugin(): ProRouterPlugin {
  return ({ router }) => {
    const breadcrumbs = shallowRef<BreadcrumbItem[]>()
    router.breadcrumbs = shallowReadonly(breadcrumbs)

    router.afterEach((to) => {
      const newBreadcrumbs: BreadcrumbItem[] = []
      to.matched.forEach(({ meta, path, name }) => {
        const { title, icon, iconColor, hideInBreadcrumb } = meta
        if (title && !hideInBreadcrumb) {
          newBreadcrumbs.push({
            path,
            icon,
            iconColor,
            title: title ?? name.toString(),
          })
        }
      })
      breadcrumbs.value = newBreadcrumbs
    })
  }
}
