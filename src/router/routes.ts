import type { Component } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

/**
 * 首页路由名称
 */
const HOME_ROUTE_PATH = '/home'

/**
 * 登录路由名称
 */
const LOGIN_ROUTE_PATH = '/login'

const notFoundRoute: RouteRecordRaw = {
  path: '/:path(.*)*',
  name: 'FallbackNotFound',
  component: () => import('@/views/demos/fallback/404.vue'),
  meta: {
    title: '404',
  },
}

/**
 * TODO: 后面把 route.name 都删掉
 */

/**
 * 忽略权限的路由
 */
const ignoreAccessRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Root',
    redirect: HOME_ROUTE_PATH,
    component: () => import('@/components/layout/index.vue'),
    children: [],
    meta: {
      hideInBreadcrumb: true,
    },
  },
  {
    path: LOGIN_ROUTE_PATH,
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录',
    },
  },
]

/**
 * 权限路由，前端权限模式下会使用该数据
 */
const accessRoutes: RouteRecordRaw[] = [
  {
    path: HOME_ROUTE_PATH,
    name: 'Home',
    component: () => import('@/views/home/index.vue'),
    meta: {
      title: '首页',
      icon: 'material-symbols:dashboard-outline-rounded',
      keepAlive: true,
      hideInBreadcrumb: false,
    },
    // children: [
    //   {
    //     name: 'User22',
    //     path: 'user',
    //     component: () => import('@/views/system/user/index.vue'),
    //     meta: {
    //       title: '用户管理',
    //       icon: 'ant-design:user-outlined',
    //       keepAlive: true,
    //       hideInBreadcrumb: false,
    //     },
    //   },
    //   {
    //     name: 'Role222222',
    //     path: 'role',
    //     component: () => import('@/views/system/role/index.vue'),
    //     meta: {
    //       title: '角色管理',
    //       icon: 'carbon:user-role',
    //       keepAlive: true,
    //       hideInBreadcrumb: false,
    //     },
    //   },
    //   {
    //     name: 'Menu2222222',
    //     path: 'menu',
    //     component: () => import('@/views/system/menu/index.vue'),
    //     meta: {
    //       title: '菜单管理',
    //       icon: 'ant-design:menu-outlined',
    //       keepAlive: true,
    //       hideInBreadcrumb: false,
    //     },
    //     children: [
    //       {
    //         name: 'User22',
    //         path: 'user',
    //         component: () => import('@/views/system/user/index.vue'),
    //         meta: {
    //           title: '用户管理',
    //           icon: 'ant-design:user-outlined',
    //           keepAlive: true,
    //           hideInBreadcrumb: false,
    //         },
    //       },
    //       {
    //         name: 'Role22',
    //         path: 'role',
    //         component: () => import('@/views/system/role/index.vue'),
    //         meta: {
    //           title: '角色管理',
    //           icon: 'carbon:user-role',
    //           keepAlive: true,
    //           hideInBreadcrumb: false,
    //         },
    //       },
    //       {
    //         name: 'Menu22',
    //         path: 'menu',
    //         component: () => import('@/views/system/menu/index.vue'),
    //         meta: {
    //           title: '菜单管理',
    //           icon: 'ant-design:menu-outlined',
    //           keepAlive: true,
    //           hideInBreadcrumb: false,
    //         },
    //         children: [
    //           {
    //             name: 'User33',
    //             path: 'user',
    //             component: () => import('@/views/system/user/index.vue'),
    //             meta: {
    //               title: '用户管理',
    //               icon: 'ant-design:user-outlined',
    //               keepAlive: true,
    //               hideInBreadcrumb: false,
    //             },
    //           },
    //           {
    //             name: 'Role33',
    //             path: 'role',
    //             component: () => import('@/views/system/role/index.vue'),
    //             meta: {
    //               title: '角色管理',
    //               icon: 'carbon:user-role',
    //               keepAlive: true,
    //               hideInBreadcrumb: false,
    //             },
    //           },
    //           {
    //             name: 'Menu33',
    //             path: 'menu',
    //             component: () => import('@/views/system/menu/index.vue'),
    //             meta: {
    //               title: '菜单管理',
    //               icon: 'ant-design:menu-outlined',
    //               keepAlive: true,
    //               hideInBreadcrumb: false,
    //             },
    //             children: [
    //               {
    //                 name: 'User333',
    //                 path: 'user',
    //                 component: () => import('@/views/system/user/index.vue'),
    //                 meta: {
    //                   title: '用户管理',
    //                   icon: 'ant-design:user-outlined',
    //                   keepAlive: true,
    //                   hideInBreadcrumb: false,
    //                 },
    //               },
    //               {
    //                 name: 'Role333',
    //                 path: 'role',
    //                 component: () => import('@/views/system/role/index.vue'),
    //                 meta: {
    //                   title: '角色管理',
    //                   icon: 'carbon:user-role',
    //                   keepAlive: true,
    //                   hideInBreadcrumb: false,
    //                 },
    //               },
    //               {
    //                 name: 'Menu3333',
    //                 path: 'menu',
    //                 component: () => import('@/views/system/menu/index.vue'),
    //                 meta: {
    //                   title: '菜单管理',
    //                   icon: 'ant-design:menu-outlined',
    //                   keepAlive: true,
    //                   hideInBreadcrumb: false,
    //                 },
    //               },
    //             ],
    //           },
    //         ],
    //       },
    //     ],
    //   },
    // ],
  },
  {
    path: '/demos',
    name: 'Demos',
    children: [
      {
        path: 'fallback',
        name: 'Falback',
        children: [
          {
            path: '403',
            name: '403',
            component: () => import('@/views/demos/fallback/403.vue'),
            meta: {
              title: '403',
              icon: 'mdi:forbid',
            },
          },
          {
            path: '404',
            name: '404',
            component: () => import('@/views/demos/fallback/404.vue'),
            meta: {
              title: '404',
              icon: 'ic:baseline-browser-not-supported',
            },
          },
          {
            path: '500',
            name: '500',
            component: () => import('@/views/demos/fallback/500.vue'),
            meta: {
              title: '500',
              icon: 'streamline-flex:monitor-error',
            },
          },
        ],
        meta: {
          title: '异常页',
          icon: 'solar:shield-warning-broken',
        },
      },
      {
        name: 'External',
        path: '/external',
        meta: {
          title: '外部页面',
          icon: 'ant-design:link-outlined',
          keepAlive: false,
          hideInBreadcrumb: true,
        },
        children: [
          {
            name: 'Baidu',
            path: 'baidu',
            component: {},
            meta: {
              title: '百度(外部打开)',
              icon: 'ri:baidu-fill',
              keepAlive: false,
              link: 'https://www.baidu.com',
            },
          },
          {
            name: 'component',
            path: 'menu',
            component: () => import('@/views/system/menu/index.vue'),
            meta: {
              title: '菜单管理(外部打开)',
              icon: 'ant-design:menu-outlined',
              keepAlive: false,
              link: true,
            },
          },
          {
            name: 'Baidu:iframe',
            path: 'baidu-iframe',
            component: {},
            meta: {
              title: '百度(iframe 打开)',
              icon: 'ri:baidu-fill',
              keepAlive: false,
              link: 'https://www.baidu.com',
              linkMode: 'iframe'
            },
          },
          {
            name: 'component:iframe',
            path: 'menu-iframe',
            component: () => import('@/views/system/menu/index.vue'),
            meta: {
              title: '菜单管理(iframe 打开)',
              icon: 'ant-design:menu-outlined',
              keepAlive: false,
              link: true,
              linkMode: 'iframe'
            },
          },
          {
            name: 'error:iframe',
            path: 'error-iframe',
            component: {},
            meta: {
              title: 'iframe 加载失败',
              icon: 'ant-design:menu-outlined',
              keepAlive: false,
              link: 'https://example.com/non-existent-page',
              linkMode: 'iframe'
            },
          },
        ],
      },
    ],
    meta: {
      title: '演示',
      icon: 'hugeicons:codesandbox',
    },
  },
  {
    name: 'System',
    path: '/system',
    meta: {
      title: '系统管理',
      icon: 'ant-design:setting-outlined',
      keepAlive: true,
      hideInBreadcrumb: false,
    },
    children: [
      {
        name: 'User',
        path: 'user',
        component: () => import('@/views/system/user/index.vue'),
        meta: {
          title: '用户管理',
          icon: 'ant-design:user-outlined',
          keepAlive: true,
          hideInBreadcrumb: false,
        },
      },
      {
        name: 'Role',
        path: 'role',
        component: () => import('@/views/system/role/index.vue'),
        meta: {
          title: '角色管理',
          icon: 'carbon:user-role',
          keepAlive: true,
          hideInBreadcrumb: false,
        },
      },
      {
        name: 'Menu',
        path: 'menu',
        component: () => import('@/views/system/menu/index.vue'),
        meta: {
          title: '菜单管理',
          icon: 'ant-design:menu-outlined',
          keepAlive: true,
          hideInBreadcrumb: false,
        },
      },
    ],
  },
]

/**
 * 页面组件映射，后端权限模式下会使用该数据
 */
const matchedPageMap = import.meta.glob('@/views/**/*.vue')
const pageMap = Object.entries(matchedPageMap).reduce<Record<string, Component>>((p, [path, value]) => {
  const paths = path.split('/')
  const lastPath = paths[paths.length - 1]
  const finalPath = lastPath.split('.').slice(0, -1).join('.')
  p[finalPath] = value
  return p
}, {})

export {
  accessRoutes,
  HOME_ROUTE_PATH,
  ignoreAccessRoutes,
  LOGIN_ROUTE_PATH,
  notFoundRoute,
  pageMap,
}
