import type {
  RbacAccessPluginBaseServiceReturned,
  RbacAccessPluginRouteRecordRawWithStringComponent,
} from '@pro/router'

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
  visitedRoutesPlugin,
} from '@pro/router'

import {
  createWebHistory,
} from 'vue-router'

import { $t } from '@/locales/locales'

import {
  useAppStore,
} from '@/store/use-app-store'

import {
  useUserStore,
} from '@/store/use-user-store'

import http from '@/utils/axios'

import {
  layoutFalsyPlugin,
} from './plugins/layout-falsy-plugin'

import {
  stateCleanupPlugin,
} from './plugins/state-cleanup-plugin'
import {
  accessRoutes,
  HOME_ROUTE_PATH,
  ignoreAccessRoutes,
  LOGIN_ROUTE_PATH,
  notFoundRoute,
  pageMap,
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
      documentTitlePlugin({
        titleTemplate: (title, to) => {
          const appStore = useAppStore()
          const { titleI18nKey } = to.meta ?? {}
          return titleI18nKey
            ? $t(titleI18nKey)
            : title ?? appStore.title
        },
      }),
      /**
       * 面包屑插件
       */
      breadcrumbPlugin({
        resolveBreadcrumb: (item, to) => {
          const appStore = useAppStore()
          const { titleI18nKey } = to.meta ?? {}
          return {
            ...item,
            title: titleI18nKey
              ? $t(titleI18nKey)
              : item.title ?? appStore.title,
          }
        },
      }),
      /**
       * 访问过的路由插件
       */
      visitedRoutesPlugin(),
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
          const appStore = useAppStore()
          const userStore = useUserStore()
          if (userStore.user.token && userStore.user.roles.length <= 0) {
            // 初始化数据
            await userStore.fetchUpdateUserInfo()
          }
          const baseInfo: RbacAccessPluginBaseServiceReturned = {
            logined: !!userStore.user.token,
            homePath: HOME_ROUTE_PATH,
            loginPath: LOGIN_ROUTE_PATH,
            parentNameForAddRoute: 'Root',
            ignoreAccessRouteNames: ignoreAccessRoutes.map(t => t.name as string),
            onRoutesBuilt: (routes) => {
              userStore.routes = routes
            },
          }
          if (appStore.accessMode === 'frontend') {
            return {
              ...baseInfo,
              mode: 'frontend',
              routes: accessRoutes,
              roles: userStore.user.roles,
            }
          }
          return {
            ...baseInfo,
            mode: 'backend',
            fetchRoutes: async () => {
              const res = await http.get<RbacAccessPluginRouteRecordRawWithStringComponent[]>('/menus/all')
              return res.data
            },
            resolveComponent: (component) => {
              let dynamicComponent = pageMap[component]
              if (!dynamicComponent) {
                dynamicComponent = () => import('@/views/demos/fallback/404.vue')
                if (__DEV__) {
                  console.warn(`[Router] 未找到组件: ${component}，替换成 404 页面`)
                }
              }
              return dynamicComponent
            },
          }
        },
      }),
      /**
       * 菜单插件，将数据转换成 n-menu 菜单数据
       */
      nMenuPlugin({
        service: () => {
          const store = useUserStore()
          return {
            routes: store.routes,
            resolveMenuItem(item, rawItem) {
              const { titleI18nKey } = rawItem.meta ?? {}
              return {
                ...item,
                label: titleI18nKey
                  ? $t(titleI18nKey)
                  : item.label,
              }
            },
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
      /**
       * 状态清理插件
       */
      stateCleanupPlugin(),
    ],
  })
  app.use(router)
  await router.isReady()
}
