import type { App } from 'vue'

import {
  autoRedirectPlugin,
  breadcrumbPlugin,
  createRouter,
  documentTitlePlugin,
  keepAlivePlugin,
  linkPlugin,
  nestedRouteRenderPlugin,
  nMenuPlugin,
  progressPlugin,
  rbacAccessPlugin,
  refreshPlugin,
  transitionPlugin,
} from '@pro/router'

import {
  createWebHistory,
} from 'vue-router'

import {
  useAppStore,
} from '@/store/use-app-store'

import {
  useUserStore,
} from '@/store/use-user-store'

import {
  layoutFalsyPlugin,
} from './plugins/layout-falsy-plugin'

import {
  accessRoutes,
  HOME_ROUTE_PATH,
  ignoreAccessRoutes,
  LOGIN_ROUTE_PATH,
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
       * 刷新插件
       */
      refreshPlugin(),
      /**
       * 路由过渡插件
       */
      transitionPlugin({
        transitionName: () => {
          return useAppStore().transitionName
        },
      }),
      /**
       * 自动重定向到目标路由插件
       */
      autoRedirectPlugin({
        redirectTo: (to) => {
          const { children } = to.matched[to.matched.length - 1]
          if (children && children.length > 0) {
            const availableRoutes = children.filter(item => !item.meta?.hideInMenu)
            if (availableRoutes.length > 0) {
              const firstAvailableRoute = availableRoutes[0]
              // 重定向到第一个可用（不隐藏的）的子路由
              return {
                replace: true,
                ...router.resolve(firstAvailableRoute),
              }
            }
          }
        },
      }),
      /**
       * 权限插件
       */
      rbacAccessPlugin({
        service: async () => {
          const store = useUserStore()
          if (store.user.token && store.user.roles.length <= 0) {
            // 初始化数据
            await store.fetchUpdateUserInfo()
          }
          return {
            mode: 'frontend',
            routes: accessRoutes,
            roles: store.user.roles,
            logined: !!store.user.token,
            homePath: HOME_ROUTE_PATH,
            loginPath: LOGIN_ROUTE_PATH,
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
      /**
       * 嵌套路由视图渲染插件，需要在嵌套路由渲染有问题的 `<RouterView>` 上
       * 设置 `:route="router.resolveNestedRoute()"`
       */
      nestedRouteRenderPlugin(),
      /**
       * 支持不显示布局的插件
       */
      layoutFalsyPlugin(),
    ],
  })
  app.use(router)
  await router.isReady()
}
