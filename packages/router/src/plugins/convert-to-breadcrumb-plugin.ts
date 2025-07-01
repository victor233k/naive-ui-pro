import type { RouteLocationNormalized } from 'vue-router'
import type { Plugin } from '../create-router'

declare module 'vue-router' {
  interface RouteMeta {
    icon?: string
    hideInBreadcrumb?: boolean
  }
}

export interface BreadcrumbItem {
  title: string
  path: string
  icon?: string
}

export interface BreadcrumbStoreLike {
  updateBreadcrumbs: (items: BreadcrumbItem[]) => void
}

export function convertToBreadcrumbPlugin(store: BreadcrumbStoreLike): Plugin {
  function buildBreadcrumbs(route: RouteLocationNormalized): BreadcrumbItem[] {
    const breadcrumbs: BreadcrumbItem[] = []
    route.matched.forEach((record) => {
      const { meta, path } = record
      if (meta?.title && !meta.hideInBreadcrumb) {
        breadcrumbs.push({
          title: meta.title,
          icon: meta.icon,
          path,
        })
      }
    })
    return breadcrumbs
  }

  return {
    name: 'route-to-breadcrumb',
    afterEach(to) {
      const breadcrumbs = buildBreadcrumbs(to)
      store.updateBreadcrumbs(breadcrumbs)
    },
  }
}
