import type { RouteRecordRaw } from 'vue-router'

const loginRouter = () => import('@/views/login.vue')
const Layout = () => import('@/components/layout/index.vue')
const IFrameView = () => import('@/views/iframe').then(m => m.IFrameView)

/** 全局404页面 */
const fallbackNotFoundRoute: RouteRecordRaw = {
  component: () => import('@/views/a.vue'),
  name: 'FallbackNotFound',
  path: '/:path(.*)*',
}

/** 基本路由，这些路由是必须存在的 */
const coreRoutes: RouteRecordRaw[] = [
  /**
   * 根路由
   * 使用基础布局，作为所有页面的父级容器，子级就不必配置BasicLayout。
   * 此路由必须存在，且不应修改
   */
  {
    meta: {
      title: 'Root',
      hideInBreadcrumb: true,
    },
    name: 'Root',
    path: '/',
    redirect: '/home',
    component: Layout,
    children: [],
  },
  // {
  //   name: 'admin',
  //   path: '/admin',
  //   meta: {
  //     title: 'admin',
  //     keepAlive: true,
  //   },
  //   component: () => import('@/views/admin.vue'),
  // },
  // {
  //   name: 'Login',
  //   path: '/login',
  //   meta: {
  //     title: 'login',
  //   },
  //   component: loginRouter,
  // },
  // {
  //   name: 'IframeView',
  //   path: '/baidu',
  //   meta: {
  //     keepAlive: true,
  //     title: 'baidu',
  //     frameUrl: 'https://www.baidu.com/',
  //   },
  //   component: IFrameView,
  // },
]

export { coreRoutes, fallbackNotFoundRoute }
