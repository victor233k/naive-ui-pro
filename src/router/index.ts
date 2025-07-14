import type { App, Component } from 'vue'
import {
  breadcrumbPlugin,
  createRouter,
  documentTitlePlugin,
  keepAlivePlugin,
  progressPlugin,
  rbacAccessPlugin,
  routeLeaveConfirmPlugin,
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
      progressPlugin(),
      // documentTitlePlugin({
      //   template: (to, from) => {
      //     return `从${from.path}到${to.path} - admain`
      //   },
      // }),
      breadcrumbPlugin(),
      keepAlivePlugin(),
      rbacAccessPlugin({
        service: async () => {
          return {
            mode: 'frontend',
            roles: ['user'],
            routes: asyncRoutes,
            homePath: '/',
            isLogin: () => true,
            parentNameForAddRoute: 'Root',
            // resolveComponent: (component) => {
            //   return pageMap[component]
            // },
          }
        },
      }),
      // routeLeaveConfirmPlugin({
      //   defaultLeaveConfig: '页面有未保存的更改，确定要离开吗？',
      // }),
    ],
  })

  // 在页面/组件里用 this.$route.meta.__autoName 拿到自动 name
  app.use(router)
}
