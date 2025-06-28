import type { App } from 'vue'
import { createWebHistory } from 'vue-router'
import { useBreadcrumbStore } from '@/store/use-breadcrumb.ts'
import { useLeaveConfirmStore } from '@/store/use-leave-onfirm'
import { useMenuStore } from '@/store/use-menu'
import { useRoutesKeepAliveStore } from '@/store/use-routes-keep-alive'
import { useTabbarStore } from '@/store/use-tabbar'
import { createRouter } from './composables/create-router'
import { documentTitlePlugin } from './plugins/documentTitlePlugin'
import { progressPlugin } from './plugins/progressPlugin'
import { routeLeaveConfirmPlugin } from './plugins/routeLeaveConfirmPlugin'
import { routesKeepAlivePlugin } from './plugins/routesKeepAlivePlugin'
import { routesToMenusPlugin } from './plugins/routesToMenusPlugin'
import { routeToBreadcrumbPlugin } from './plugins/routeToBreadcrumbPlugin'
import { tabbarPlugin } from './plugins/tabbarPlugin'
import { routes } from './routes'

export async function setupRouter(app: App) {
  const menusStore = useMenuStore()
  const tabbarStore = useTabbarStore()
  const breadcrumb = useBreadcrumbStore()
  const routesKeepAliveStore = useRoutesKeepAliveStore()
  const leaveConfirmstore = useLeaveConfirmStore()

  const router = createRouter({
    history: createWebHistory(),
    routes,
    plugins: [
      progressPlugin(),
      documentTitlePlugin({
        template: (title, ctx) => {
          const { to, from } = ctx
          return `${title}从${from.path}到${to.path} - admain`
        },
      }),
      routesKeepAlivePlugin(
        routesKeepAliveStore,
        routes,
      ),
      tabbarPlugin(tabbarStore),
      routesToMenusPlugin(menusStore, routes),
      routeToBreadcrumbPlugin(breadcrumb),
      routeLeaveConfirmPlugin(leaveConfirmstore, routes),
    ],
  })
  app.use(router)
}
