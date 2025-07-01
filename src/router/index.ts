import type { App } from 'vue'
import {
  convertToBreadcrumbPlugin,
  convertToMenusPlugin,
  createRouter,
  documentTitlePlugin,
  keepAlivePlugin,
  progressPlugin,
  routeLeaveConfirmPlugin,
  tabbarPlugin,
} from '@pro/router'
import { createWebHistory } from 'vue-router'
import { useBreadcrumbStore } from '@/store/use-breadcrumb.ts'
import { useLeaveConfirmStore } from '@/store/use-leave-onfirm'
import { useMenuStore } from '@/store/use-menu'
import { useRoutesKeepAliveStore } from '@/store/use-routes-keep-alive'
import { useTabbarStore } from '@/store/use-tabbar'
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
      keepAlivePlugin(
        routesKeepAliveStore,
        routes,
      ),
      tabbarPlugin(tabbarStore),
      convertToMenusPlugin(menusStore, routes),
      convertToBreadcrumbPlugin(breadcrumb),
      routeLeaveConfirmPlugin(leaveConfirmstore, routes),
    ],
  })
  app.use(router)
}
