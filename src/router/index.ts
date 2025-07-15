import type { App } from 'vue'
import {
  breadcrumbPlugin,
  createRouter,
  documentTitlePlugin,
  keepAlivePlugin,
  linkPlugin,
  nMenuPlugin,
  progressPlugin,
  rbacAccessPlugin,
  transitionPlugin,
} from '@pro/router'

import {
  createWebHistory,
} from 'vue-router'

import {
  accessRoutes,
  HOME_ROUTE_NAME,
  ignoreAccessRoutes,
  LOGIN_ROUTE_NAME,
  notFoundRoute,
} from './routes'

export async function setupRouter(app: App) {
  const router = createRouter({
    history: createWebHistory(),
    routes: [
      ...ignoreAccessRoutes,
      notFoundRoute,
    ],
    plugins: [
      /**
       * 路由进度条插件
       */
      progressPlugin(),
      /**
       * 路由标题插件
       */
      documentTitlePlugin(),
      /**
       * 面包屑插件
       */
      breadcrumbPlugin(),
      /**
       * 外链插件，用于处理外链跳转
       */
      linkPlugin(),
      /**
       * 路由缓存插件
       */
      keepAlivePlugin(),
      /**
       * 路由过渡插件
       */
      transitionPlugin(),
      /**
       * 权限插件
       */
      rbacAccessPlugin({
        service: () => {
          return {
            roles: [],
            logined: false,
            mode: 'frontend',
            routes: accessRoutes,
            homeName: HOME_ROUTE_NAME,
            loginName: LOGIN_ROUTE_NAME,
            parentNameForAddRoute: 'Root',
            ignoreAccessRouteNames: ignoreAccessRoutes.map(t => t.name as string),
          }
        },
      }),
      /**
       * 菜单插件，将数据转换成 n-menu 菜单数据
       */
      nMenuPlugin({
        service: () => {
          return {
            routes: accessRoutes,
          }
        },
      }),
    ],
  })
  app.use(router)
  await router.isReady()
}
