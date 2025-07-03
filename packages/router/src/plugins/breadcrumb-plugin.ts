import type { ComputedRef } from 'vue'
import type { ProRouterPlugin } from '../create-router'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

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
    breadcrumbs: ComputedRef<BreadcrumbItem[]>
  }
}

interface BreadcrumbItem {
  path: string
  title: string
  icon?: string
  iconColor?: string
}

export function breadcrumbPlugin(): ProRouterPlugin {
  return {
    name: '@pro/router-plugin-breadcrumb',
    afterEach() {
      if (!this.breadcrumbs) {
        const route = useRoute()
        this.breadcrumbs = computed(() => {
          const breadcrumbs: BreadcrumbItem[] = []
          route.matched.forEach(({ meta, path, name }) => {
            const { title, icon, iconColor, hideInBreadcrumb } = meta
            if (title && !hideInBreadcrumb) {
              breadcrumbs.push({
                path,
                icon,
                iconColor,
                title: title ?? name.toString(),
              })
            }
          })
          return breadcrumbs
        })
      }
    },
  }
}
