import type { App, Component } from 'vue'
import {
  breadcrumbPlugin,
  createRouter,
  documentTitlePlugin,
  keepAlivePlugin,
  progressPlugin,
  rbacAccessPlugin,
  transitionPlugin,
} from '@pro/router'
import { isFunction } from 'lodash-es'
import { createWebHistory } from 'vue-router'
import { useRoutesKeepAliveStore } from '@/store/use-routes-keep-alive'
import A from '@/views/basic-list.vue'
import { asyncRoutes, mockRoutes, routes } from './routes'

const matchedPageMap = import.meta.glob('@/views/**/*.vue')
const pageMap = Object.entries(matchedPageMap).reduce<Record<string, Component>>((p, [path, value]) => {
  const paths = path.split('/')
  const lastPath = paths[paths.length - 1]
  const finalPath = lastPath.split('.').slice(0, -1).join('.')
  p[finalPath] = value
  return p
}, {})

export async function setupRouter(app: App) {
  const router = createRouter({
    history: createWebHistory(),
    routes,
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
       * 路由缓存插件
       */
      keepAlivePlugin(),
      /**
       * 路由过渡插件
       */
      transitionPlugin({
        defaultTransitionName: 'fade-down',
      }),
      /**
       * 权限插件
       */
      rbacAccessPlugin({
        service: async () => {
          return {
            mode: 'frontend',
            roles: ['user'],
            routes: asyncRoutes,
            homeName: 'Root',
            isLogin: () => true,
            parentNameForAddRoute: 'Root',
            // resolveComponent: (component) => {
            //   return pageMap[component]
            // },
          }
        },
      }),
    ],
  })

  app.use(router)
}
