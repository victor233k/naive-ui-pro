import type { App } from 'vue'
import {
  breadcrumbPlugin,
  createRouter,
  documentTitlePlugin,
  keepAlivePlugin,
  progressPlugin,
  rbacAccessPlugin,
  routeLeaveConfirmPlugin,
} from '@pro/router'
import { createWebHistory } from 'vue-router'
import { routes } from './routes'

export async function setupRouter(app: App) {
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
      // keepAlivePlugin(
      //   routesKeepAliveStore,
      //   routes,
      // ),
      routeLeaveConfirmPlugin(),
    ],
  })
  app.use(router)
}
