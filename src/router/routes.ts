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
      titleI18nKey: 'routes.login',
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
      titleI18nKey: 'routes.home',
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
              titleI18nKey: 'routes.accessToggle',
              icon: 'mdi:page-previous-outline',
            },
          },
        ],
        meta: {
          title: '权限',
          titleI18nKey: 'routes.access',
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
          titleI18nKey: 'routes.exception',
          icon: 'solar:shield-warning-broken',
        },
      },
      {
        path: 'editor',
        name: 'EditorDemo',
        component: () => import('@/views/demos/access/editor/index.vue'),
        meta: {
          title: '富文本编辑器',
          titleI18nKey: 'routes.richTextEditor',
          icon: 'material-symbols:edit-document-outline',
        },
      },
      {
        name: 'External',
        path: '/external',
        meta: {
          title: '外部页面',
          titleI18nKey: 'routes.externalPage',
          icon: 'ant-design:link-outlined',
        },
        children: [
          {
            name: 'iframe',
            path: 'iframe',
            children: [
              {
                path: 'form',
                name: 'form',
                component: {},
                meta: {
                  title: '复杂表单',
                  titleI18nKey: 'routes.complexForm',
                  icon: 'lets-icons:form',
                  link: 'https://naive-ui.pro-components.cn/zh-CN/os-theme/components/form-list#list-nest.vue',
                  linkMode: 'iframe',
                },
              },
              {
                path: 'edit-data-table',
                name: 'EditDataTable',
                component: {},
                meta: {
                  title: '编辑表格',
                  titleI18nKey: 'routes.editTable',
                  icon: 'material-symbols:table-outline',
                  link: 'https://naive-ui.pro-components.cn/zh-CN/os-theme/components/edit-data-table#async.vue',
                  linkMode: 'iframe',
                },
              },
            ],
            meta: {
              title: '内嵌',
              titleI18nKey: 'routes.embedded',
              icon: 'material-symbols:iframe',
            },
          },
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
                  titleI18nKey: 'routes.externalOpenRoute',
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
                  titleI18nKey: 'routes.noLayout',
                  icon: 'ant-design:menu-outlined',
                  layout: false,
                  openInNewWindow: true,
                },
              },
              {
                name: 'component',
                path: 'menu',
                component: () => import('@/views/system/menu/index.vue'),
                meta: {
                  title: '菜单管理(外部打开)',
                  titleI18nKey: 'routes.menuManagementExternal',
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
                  titleI18nKey: 'routes.baiduIframe',
                  icon: 'ri:baidu-fill',
                  keepAlive: false,
                  link: 'https://www.baidu.com',
                  linkMode: 'iframe',
                },
              },
              {
                name: 'component:iframe',
                path: 'menu-iframe',
                component: () => import('@/views/system/menu/index.vue'),
                meta: {
                  title: '菜单管理(iframe 打开)',
                  titleI18nKey: 'routes.menuManagementIframe',
                  icon: 'ant-design:menu-outlined',
                  keepAlive: false,
                  link: true,
                  linkMode: 'iframe',
                },
              },
              {
                name: 'error:iframe',
                path: 'error-iframe',
                component: {},
                meta: {
                  title: 'iframe 加载失败',
                  titleI18nKey: 'routes.iframeLoadFailed',
                  icon: 'ant-design:menu-outlined',
                  keepAlive: false,
                  link: 'https://example.com/non-existent-page',
                  linkMode: 'iframe',
                },
              },
            ],
            meta: {
              title: '外链',
              titleI18nKey: 'routes.externalLink',
              icon: 'akar-icons:link-out',
            },
          },
        ],
      },
      {
        path: 'icon',
        name: 'Icon',
        component: () => import('@/views/demos/icon/index.vue'),
        meta: {
          title: '图标选择器',
          titleI18nKey: 'routes.iconSelector',
          icon: 'mdi:image-outline',
        },
      },
    ],
    meta: {
      title: '演示',
      titleI18nKey: 'routes.demo',
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
          titleI18nKey: 'routes.userManagement',
          icon: 'ant-design:user-outlined',
          roles: ['super', 'admin'],
        },
      },
      {
        name: 'Role',
        path: 'role',
        component: () => import('@/views/system/role/index.vue'),
        meta: {
          title: '角色管理',
          titleI18nKey: 'routes.roleManagement',
          icon: 'carbon:user-role',
          roles: ['super'],
        },
      },
      {
        name: 'Menu',
        path: 'menu',
        component: () => import('@/views/system/menu/index.vue'),
        meta: {
          title: '菜单管理',
          titleI18nKey: 'routes.menuManagement',
          icon: 'ant-design:menu-outlined',
          roles: ['super'],
        },
      },
    ],
    meta: {
      title: '系统管理',
      titleI18nKey: 'routes.system',
      icon: 'ant-design:setting-outlined',
      roles: ['super', 'admin'],
    },
  },
]

/**
 * 页面组件映射，后端权限模式下会使用该数据
 */
const matched = import.meta.glob('@/views/**/*.vue')
const pageMap = Object.entries(matched).reduce<Record<string, Component>>((p, [path, value]) => {
  const finalPath = `/${path.split('/').slice(3).join('/')}`
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
