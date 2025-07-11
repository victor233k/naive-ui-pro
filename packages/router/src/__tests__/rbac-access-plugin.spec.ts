import type { RouteRecordRaw } from 'vue-router'
import type { RouteRecordRawStringComponent } from '../plugins/rbac-access-plugin'
import { describe, expect, it } from 'vitest'
import { createWebHashHistory } from 'vue-router'
import { createRouter } from '../../src/create-router'
import { rbacAccessPlugin } from '../plugins/rbac-access-plugin'

const Admin = { template: `<div>Admin</div>` }
const Login = { template: `<div>Login</div>` }
const Layout = { template: `<div>Layout</div>` }
const NotFound = { template: `<div>NotFound</div>` }
const Register = { template: `<div>Register</div>` }
const BasicInfo = { template: `<div>BasicInfo</div>` }
const BasicList = { template: `<div>BasicList</div>` }

const coreRoutes: RouteRecordRaw[] = [
  {
    meta: {
      title: 'Root',
      hideInBreadcrumb: true,
    },
    name: 'Root',
    path: '/',
    redirect: '/list',
    component: Layout,
    children: [],
  },
  {
    name: 'admin',
    path: '/admin',
    meta: {
      title: 'admin',
      keepAlive: true,
    },
    component: Admin,
  },
  {
    name: 'Login',
    path: '/login',
    meta: {
      title: 'login',
    },
    component: Login,
  },
  {
    name: 'Register',
    path: '/register',
    meta: {
      title: 'Register',
    },
    component: Register,
  },
  {
    name: 'FallbackNotFound',
    path: '/:path(.*)*',
    component: () => NotFound,
  },
]

const asyncRoutes: RouteRecordRaw[] = [
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
          keepAlive: true,
        },
        component: () => BasicList,
      },
      {
        name: 'basic-info',
        path: 'basic-info',
        meta: {
          title: 'basic-info',
          keepAlive: true,
        },
        component: () => BasicInfo,
      },
    ],
  },
]

// 封装router初始化函数，便于不同登录状态下测试
function setupRouter(isLogin: boolean) {
  return createRouter({
    history: createWebHashHistory(),
    routes: coreRoutes,
    plugins: [
      rbacAccessPlugin({
        service: async () => {
          return {
            mode: 'frontend',
            isLogin: () => isLogin,
            routes: asyncRoutes,
            homePath: '/',
            roles: [],
            parentNameForAddRoute: 'Root',
          }
        },
      }),
    ],
  })
}

describe('rbac-access-plugin', () => {
  describe('not-login', () => {
    it('初始化跳转已存在路由，应跳转到 /login?redirect=/list', async () => {
      const router = setupRouter(false)
      await router.push('/')
      expect(router.currentRoute.value.fullPath).toBe('/login?redirect=/list')
    })

    it('初始化跳转登录路由，应正常跳转且无 redirect 参数', async () => {
      const router = setupRouter(false)
      await router.push('/login')
      expect(router.currentRoute.value.fullPath).toBe('/login')
      expect(router.currentRoute.value.query.redirect).toBeUndefined()
    })

    it('已存在路由跳转已存在路由，应跳转到 /admin', async () => {
      const router = setupRouter(false)
      await router.push('/register')
      await router.push('/admin')
      expect(router.currentRoute.value.fullPath).toBe('/admin')
    })

    it('已存在路由跳转登录路由，应跳转到 /login', async () => {
      const router = setupRouter(false)
      await router.push('/register')
      await router.push('/login')
      expect(router.currentRoute.value.fullPath).toBe('/login')
    })

    it('当前为登录页，跳转登录页，应无 redirect 参数', async () => {
      const router = setupRouter(false)
      await router.push('/login')
      await router.push('/login')
      expect(router.currentRoute.value.fullPath).toBe('/login')
      expect(router.currentRoute.value.query.redirect).toBeUndefined()
    })

    it('跳转不存在的路由，应跳转 NotFound 页面', async () => {
      const router = setupRouter(false)
      await router.push('/not-exist')
      expect(router.currentRoute.value.name).toBe('FallbackNotFound')
    })
  })

  describe('logined', () => {
    it('跳转登录页，应跳转到首页 /', async () => {
      const router = setupRouter(true)
      await router.push('/login')
      expect(router.currentRoute.value.fullPath).toBe('/list/basic-list')
    })

    it('跳转存在的基础路由，应正常跳转', async () => {
      const router = setupRouter(true)
      await router.push('/admin')
      expect(router.currentRoute.value.fullPath).toBe('/admin')
    })

    it('跳转存在的动态路由，应正常跳转', async () => {
      const router = setupRouter(true)
      await router.push({ name: 'basic-info' })
      expect(router.currentRoute.value.name).toBe('basic-info')
    })

    it('跳转不存在的路由，应跳转 NotFound 页面', async () => {
      const router = setupRouter(true)
      await router.push('/not-exist')
      expect(router.currentRoute.value.name).toBe('FallbackNotFound')
    })
  })
})

/**
* 1、未登录
*   1) 初始化跳转已存在路由；预期：正常跳转
*   2) 初始化跳转登录路由；预期：正常跳转，不携带 redirect 参数
*   3）已存在路由跳转已存在路由；预期：正常跳转
*   4）当前为登录页，跳转登录页；预期：redirect 参数为空
*   5) 跳转不存在的路由；预期：跳转 NotFound 页面
* 2、已登录
*   1) 跳转登录页;预期：跳转到首页
*   2）跳转存在的路由；预期：正常跳转
*   3）跳转不存在路由；预期：跳转 NotFound 页面
*/
