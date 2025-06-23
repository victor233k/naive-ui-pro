import type { RouteRecordRaw } from 'vue-router'

const loginRouter = () => import('@/views/login.vue')
/** 全局404页面 */
const fallbackNotFoundRoute: RouteRecordRaw = {
  component: loginRouter,
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
    name: 'Root',
    path: '/',
    redirect: '/admain',
  },
  {
    name: 'Admain',
    path: '/admain',
    meta: {
      title: 'admain',
    },
    component: () => import('@/views/admin.vue'),
  },
  {
    name: 'Login',
    path: '/login',
    meta: {
      title: 'login',
    },
    component: loginRouter,
  },
  {
    name: 'List',
    path: '/list',
    meta: {
      title: 'list',
      keepAlive: true,
    },
    component: () => import('@/views/list.vue'),
  },
  {
    name: 'Detail',
    path: '/detail',
    meta: {
      title: 'detail',
    },
    component: () => import('@/views/detail.vue'),
  },
]

export { coreRoutes, fallbackNotFoundRoute }
