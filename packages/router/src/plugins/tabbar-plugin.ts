import type { RouteLocationNormalized } from 'vue-router'
import type { Plugin } from '../create-router'

declare module 'vue-router' {
  interface RouteMeta {
    /**
     * 是否不展示为 Tab
     */
    noTab?: boolean
  }
}

export interface TabbarStoreLike {
  addTab: (route: RouteLocationNormalized) => void
}

export function tabbarPlugin(store: TabbarStoreLike): Plugin {
  const { addTab } = store

  return {
    name: 'tabbar-plugin',
    afterEach(to) {
      if (to.meta?.noTab) {
        return
      }
      addTab(to)
    },
  }
}
