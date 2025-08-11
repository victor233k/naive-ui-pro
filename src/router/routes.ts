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
    },
  },
  {
    path: '/demos',
    name: 'Demos',
    children: [
      {
        path: 'access',
        name: 'Access',
        children: [
          {
            path: 'toggle',
            name: 'Toggle',
            component: () => import('@/views/demos/access/toggle/index.vue'),
            meta: {
              title: '权限切换',
              icon: 'mdi:page-previous-outline',
            },
          },
          // {
          //   path: 'super-visibility',
          //   name: 'SuperVisibility',
          //   component: () => import('@/views/demos/access/visibility/super.vue'),
          //   meta: {
          //     title: 'Super 可见',
          //     icon: 'tdesign:user-visible-filled',
          //     roles: ['Super'],
          //   },
          // },
          // {
          //   path: 'admin-visibility',
          //   name: 'AdminVisibility',
          //   component: () => import('@/views/demos/access/visibility/admin.vue'),
          //   meta: {
          //     title: 'Admin 可见',
          //     icon: 'tdesign:user-visible-filled',
          //     roles: ['Admin'],
          //   },
          // },
          // {
          //   path: 'user-visibility',
          //   name: 'UserVisibility',
          //   component: () => import('@/views/demos/access/visibility/user.vue'),
          //   meta: {
          //     title: 'User 可见',
          //     icon: 'tdesign:user-visible-filled',
          //     roles: ['User'],
          //   },
          // },
        ],
        meta: {
          title: '权限',
          icon: 'material-symbols:lock-outline',
        },
      },
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
        },
        children: [
          {
            name: 'Link',
            path: 'link',
            children: [
              {
                name: 'Vite',
                path: 'vite',
                component: {},
                meta: {
                  icon: 'logos:vitejs',
                  link: 'https://vite.dev',
                },
              },
              {
                name: 'Vue',
                path: 'vue',
                component: {},
                meta: {
                  icon: 'logos:vue',
                  link: 'https://vuejs.org/',
                },
              },
              {
                name: 'OpenNewWindow',
                path: 'menu',
                component: () => import('@/views/system/menu/index.vue'),
                meta: {
                  title: '外部打开路由',
                  icon: 'ant-design:menu-outlined',
                  openInNewWindow: true,
                },
              },
              {
                name: 'LayoutFalsy',
                path: 'menu-layout-falsy',
                component: () => import('@/views/system/menu/index.vue'),
                meta: {
                  title: '无布局',
                  icon: 'ant-design:menu-outlined',
                  layout: false,
                  openInNewWindow: true,
                },
              },
            ],
            meta: {
<<<<<<< HEAD
              title: '外链',
              icon: 'akar-icons:link-out',
=======
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
>>>>>>> 1da732e0c95dc27fcfea7515c16a1d77b3d965c7
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
    children: [
      {
        name: 'User',
        path: 'user',
        component: () => import('@/views/system/user/index.vue'),
        meta: {
          title: '用户管理',
          icon: 'ant-design:user-outlined',
        },
      },
      {
        name: 'Role',
        path: 'role',
        component: () => import('@/views/system/role/index.vue'),
        meta: {
          title: '角色管理',
          icon: 'carbon:user-role',
        },
      },
      {
        name: 'Menu',
        path: 'menu',
        component: () => import('@/views/system/menu/index.vue'),
        meta: {
          title: '菜单管理',
          icon: 'ant-design:menu-outlined',
        },
      },
    ],
    meta: {
      title: '系统管理',
      icon: 'ant-design:setting-outlined',
    },
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
