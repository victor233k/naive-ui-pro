import type { RouteRecordRaw } from 'vue-router'

const asyncRoutes: Array<RouteRecordRaw> = [
  {
    path: '/list',
    name: 'List',
    redirect: '/list/basic-list',
    meta: {
      title: 'List',
      roles: ['user'],
    },
    children: [
      {
        name: 'basic-list',
        path: 'basic-list',
        meta: {
          title: 'basic-list',
          keepAlive: true,
          roles: ['user'],
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
        },
        component: () => import('@/views/basic-info.vue'),
      },
      {
        path: 'basic-demo/:id?',
        name: 'basic-demo',
        meta: {
          title: 'basic-demo',
        },
        component: () => import('@/views/basic-demo.vue'),
      },
    ],
  },
  {
    path: '/list/r',
    name: 'r-list',
    redirect: '/r',
    meta: {
      title: 'AList',
      keepAlive: true,
      roles: ['user'],
    },
    children: [],
    component: () => import('@/views/a-list.vue'),
  },
  {
    path: '/r',
    name: 'r',
    meta: {
      title: 'r',
      keepAlive: true,
      roles: ['user'],
    },
    component: () => import('@/views/a.vue'),
  },
]

const mockRoutes = [
  {
    path: '/list',
    name: 'List',
    redirect: '/list/basic-list',
    meta: {
      title: 'List',
      roles: ['user'],
    },
    component: 'basic-list',
    children: [
      {
        name: 'basic-list',
        path: 'basic-list',
        meta: {
          title: 'basic-list',
          keepAlive: true,
          roles: ['user'],
        },
        component: 'basic-list',
        children: [
          {
            path: 'basic-list-item',
            name: 'basic-list-item',
            meta: {
              title: 'basic-list-item',
              keepAlive: true,
            },
            component: 'basic-list-item',
          },
        ],
      },
    ],
  },
]

export { asyncRoutes, mockRoutes }
