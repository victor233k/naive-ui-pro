import { defineFakeRoute } from 'vite-plugin-fake-server/client'
import { buildCURDRoutes } from './utils/curd'
import { database } from './utils/database'

const users = [
  {
    username: 'super',
    password: '123456',
    token:
      'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJzdXBlciIsImV4cCI6MTczMjI0MzYyNn0.super',
    roles: ['super'],
    name: 'Super',
    codes: ['1001', '1002', '1003', '1004'],
    menus: [
      {
        path: '/home',
        name: 'Home',
        component: '/home/index.vue',
        meta: {
          title: '首页',
          icon: 'material-symbols:dashboard-outline-rounded',
          titleI18nKey: 'routes.home',
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
                component: '/demos/access/toggle/index.vue',
                meta: {
                  title: '权限切换',
                  icon: 'mdi:page-previous-outline',
                  titleI18nKey: 'routes.accessToggle',
                },
              },
            ],
            meta: {
              title: '权限',
              icon: 'material-symbols:lock-outline',
              titleI18nKey: 'routes.access',
            },
          },
        ],
        meta: {
          title: '演示',
          icon: 'hugeicons:codesandbox',
          titleI18nKey: 'routes.demo',
        },
      },
      {
        name: 'System',
        path: '/system',
        children: [
          {
            name: 'User',
            path: 'user',
            component: '/system/user/index.vue',
            meta: {
              title: '用户管理',
              icon: 'ant-design:user-outlined',
              titleI18nKey: 'routes.userManagement',
            },
          },
          {
            name: 'Role',
            path: 'role',
            component: '/system/role/index.vue',
            meta: {
              title: '角色管理',
              icon: 'carbon:user-role',
              titleI18nKey: 'routes.roleManagement',
            },
          },
          {
            name: 'Menu',
            path: 'menu',
            component: '/system/menu/index.vue',
            meta: {
              title: '菜单管理',
              icon: 'ant-design:menu-outlined',
              titleI18nKey: 'routes.menuManagement',
            },
          },
        ],
        meta: {
          title: '系统管理',
          icon: 'ant-design:setting-outlined',
          titleI18nKey: 'routes.system',
        },
      },
    ],
  },
  {
    username: 'admin',
    password: '123456',
    token:
      'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImV4cCI6MTczMjI0MzYyNn0.admin',
    roles: ['admin'],
    name: 'Admin',
    codes: ['1003'],
    menus: [
      {
        path: '/home',
        name: 'Home',
        component: '/home/index.vue',
        meta: {
          title: '首页',
          icon: 'material-symbols:dashboard-outline-rounded',
          titleI18nKey: 'routes.home',
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
                component: '/demos/access/toggle/index.vue',
                meta: {
                  title: '权限切换',
                  icon: 'mdi:page-previous-outline',
                  titleI18nKey: 'routes.accessToggle',
                },
              },
            ],
            meta: {
              title: '权限',
              icon: 'material-symbols:lock-outline',
              titleI18nKey: 'routes.access',
            },
          },
        ],
        meta: {
          title: '演示',
          icon: 'hugeicons:codesandbox',
          titleI18nKey: 'routes.demo',
        },
      },
      {
        name: 'System',
        path: '/system',
        children: [
          {
            name: 'User',
            path: 'user',
            component: '/system/user/index.vue',
            meta: {
              title: '用户管理',
              icon: 'ant-design:user-outlined',
              titleI18nKey: 'routes.userManagement',
            },
          },
        ],
        meta: {
          title: '系统管理',
          icon: 'ant-design:setting-outlined',
          titleI18nKey: 'routes.system',
        },
      },
    ],
  },
  {
    username: 'user',
    password: '123456',
    token:
      'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ1c2VyIiwiZXhwIjoxNzMyMjQzNjI2fQ.user',
    roles: ['user'],
    name: 'User',
    codes: [],
    menus: [
      {
        path: '/home',
        name: 'Home',
        component: '/home/index.vue',
        meta: {
          title: '首页',
          icon: 'material-symbols:dashboard-outline-rounded',
          titleI18nKey: 'routes.home',
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
                component: '/demos/access/toggle/index.vue',
                meta: {
                  title: '权限切换',
                  icon: 'mdi:page-previous-outline',
                  titleI18nKey: 'routes.accessToggle',
                },
              },
            ],
            meta: {
              title: '权限',
              icon: 'material-symbols:lock-outline',
              titleI18nKey: 'routes.access',
            },
          },
        ],
        meta: {
          title: '演示',
          icon: 'hugeicons:codesandbox',
          titleI18nKey: 'routes.demo',
        },
      },
    ],
  },
]

function createSuccessResponse(data: any) {
  return {
    data,
    code: 200,
    message: 'success',
  }
}

function createErrorResponse(message: string) {
  return {
    message,
    code: 201,
    data: null,
  }
}

function isInvalidToken(token: string) {
  return !token || !users.some(user => user.token === token)
}

const systemRoleRoutes = buildCURDRoutes('/system/role', database.role)
const systemUserRoutes = buildCURDRoutes('/system/user', database.user)
const systemMenuRoutes = buildCURDRoutes('/system/menu', database.menu)

export default defineFakeRoute([
  ...systemRoleRoutes,
  ...systemUserRoutes,
  ...systemMenuRoutes,
  {
    url: '/user/login',
    method: 'post',
    response: ({ body }) => {
      const user = users.find(user => user.username === body.username && user.password === body.password)
      if (!user) {
        return createErrorResponse('用户名或密码错误')
      }
      return createSuccessResponse({ token: user.token })
    },
  },
  {
    url: '/user/info',
    method: 'get',
    response: ({ headers }) => {
      const token = (headers.authorization ?? '').slice(7)
      if (isInvalidToken(token)) {
        return createErrorResponse('token 无效')
      }
      const user = users.find(user => user.token === token)
      if (!user) {
        return createErrorResponse('用户名或密码错误')
      }
      return createSuccessResponse({
        name: user.name,
        roles: user.roles,
        codes: user.codes,
      })
    },
  },
  {
    url: '/menus/all',
    method: 'get',
    response: ({ headers }) => {
      const token = (headers.authorization ?? '').slice(7)
      if (isInvalidToken(token)) {
        return createErrorResponse('token 无效')
      }
      const user = users.find(user => user.token === token)
      if (!user) {
        return createErrorResponse('用户名或密码错误')
      }
      return createSuccessResponse(user.menus)
    },
  },
])
