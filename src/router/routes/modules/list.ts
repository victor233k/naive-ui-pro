import type { RouteRecordRaw } from 'vue-router'
import { Layout } from '@/router/constant'
import { renderIcon } from '@/utils/index'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/list',
    name: 'List',
    redirect: '/list/basic-list',
    meta: {
      title: '列表页面',
    },
    children: [
      {
        path: 'basic-list',
        name: 'basic-list',
        meta: {
          title: '基础列表',
          keepAlive: {
            noCacheWhenBackFrom: ['basic-info'],
          },
        },
        component: () => import('@/views/list.vue'),
      },
      {
        path: 'basic-info/:id?',
        name: 'basic-info',
        meta: {
          title: '基础详情',
          keepAlive: true,
        },
        component: () => import('@/views/detail.vue'),
      },
    ],
  },
]

export default routes
