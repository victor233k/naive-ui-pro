import type { RouteRecordRaw } from 'vue-router'

const loginRouter = () => import('@/views/login.vue')
const Layout = () => import('@/components/layout/index.vue')
const IFrameView = () => import('@/views/iframe').then(m => m.IFrameView)

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
    component: Layout,
    meta: {
      title: 'Root',
      hideInBreadcrumb: true,
    },
    name: 'Root',
    path: '/',
    redirect: '/list',
    children: [
      {
        path: '/list',
        name: 'List',
        redirect: '/list/basic-list',
        meta: {
          title: 'List',
        },
        children: [
          {
            name: 'basic-list',
            path: 'basic-list',
            meta: {
              title: 'basic-list',
              keepAlive: {
                noCacheWhenBackFrom: ['basic-info'],
              },
            },
            component: () => import('@/views/basic-list.vue'),
            children: [
              {
                path: 'basic-list-item',
                name: 'basic-list-item',
                meta: {
                  title: 'basic-list-item',
                  keepAlive: true,
                },
                component: () => import('@/views/basic-list-item.vue'),
              },
            ],
          },
          {
            path: 'basic-info/:id?',
            name: 'basic-info',
            meta: {
              title: 'basic-info',
              leaveConfirm: true,
              keepAlive: true,
            },
            component: () => import('@/views/basic-info.vue'),
          },
        ],
      },
    ],
  },
  {
    name: 'Admain',
    path: '/admain',
    meta: {
      title: 'admain',
      keepAlive: true,
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
    name: 'IframeView',
    path: '/baidu',
    meta: {
      keepAlive: true,
      title: 'baidu',
      frameUrl: 'https://www.baidu.com/',
    },
    component: IFrameView,
  },
]

export { coreRoutes, fallbackNotFoundRoute }
