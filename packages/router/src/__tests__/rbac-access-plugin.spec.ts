import type { RouteRecordRaw } from 'vue-router'
import type { RbacAccessPluginBackendServiceReturned, RbacAccessPluginFrontendServiceReturned } from '../types'
import { describe, expect, it } from 'vitest'
import { createApp } from 'vue'
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

type RbacAccessPluginServiceReturned = RbacAccessPluginBackendServiceReturned | RbacAccessPluginFrontendServiceReturned

const rootRoute = {
  name: 'Root',
  path: '/',
  redirect: '/list',
  component: Layout,
  children: [],
}

const notFoundRoute = {
  name: 'FallbackNotFound',
  path: '/:path(.*)*',
  component: () => NotFound,
}

const ignoreAccessRoutes: RouteRecordRaw[] = [
  {
    name: 'admin',
    path: '/admin',
    component: Admin,
    meta: {
      requiresAuth: false,
    },
  },
  {
    name: 'Login',
    path: '/login',
    component: Login,
    meta: {
      requiresAuth: false,
    },
  },
  {
    name: 'Register',
    path: '/register',
    component: Register,
    meta: {
      requiresAuth: false,
    },
  },
]

const accessRoutes: RouteRecordRaw[] = [
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

function setupRouter(options: Partial<RbacAccessPluginServiceReturned> = {}, notFoundRouteRequiresAuth = false) {
  let finalOptions = {
    mode: 'frontend',
    routes: accessRoutes,
    homePath: '/',
    roles: [],
    parentNameForAddRoute: 'Root',
    logined: false,
    ...(options as any),
  }
  const app = createApp({})
  const router = createRouter({
    history: createWebHashHistory(),
    routes: [
      rootRoute,
      ...ignoreAccessRoutes,
      {
        ...notFoundRoute,
        meta: {
          requiresAuth: notFoundRouteRequiresAuth,
        },
      },
    ],
    plugins: [
      rbacAccessPlugin({
        service: async () => {
          return finalOptions
        },
      }),
    ],
  })
  app.use(router)
  app.mount(document.createElement('div'))
  return {
    ...router,
    unmount: () => {
      app.unmount()
    },
    setOptions: (value: Partial<RbacAccessPluginServiceReturned>) => {
      finalOptions = {
        ...finalOptions,
        ...value,
      }
    },
  }
}

describe('rbac-access-plugin', () => {
  describe('not-login', () => {
    it('redirect to NotFound when navigation to not exsit path', async () => {
      const router = setupRouter({})
      await router.push('/')
      expect(router.currentRoute.value.name).toBe('FallbackNotFound')
      router.unmount()
    })

    it('redirect to Login when navigation to not exsit path', async () => {
      const router = setupRouter({ }, true)
      await router.push('/list?a=1')
      expect(router.currentRoute.value.name).toBe('Login')
      expect(router.currentRoute.value.fullPath).toBe('/login?redirect=/list?a=1')
      router.unmount()
    })

    it('navigation to constant path', async () => {
      const router = setupRouter()
      await router.push('/register')
      await router.push('/admin')
      expect(router.currentRoute.value.fullPath).toBe('/admin')
      router.unmount()
    })
  })

  describe('logined', () => {
    it('redirect to Home when navigation to Login', async () => {
      const router = setupRouter({ logined: true })
      await router.push('/login')
      expect(router.currentRoute.value.fullPath).toBe('/list/basic-list')
      router.unmount()
    })

    it('redirect to query redirect params when navigation to Login', async () => {
      const router = setupRouter({ logined: true })
      await router.push('/login?redirect=/list/basic-info?a=1')
      expect(router.currentRoute.value.fullPath).toBe('/list/basic-info?a=1')
      router.unmount()
    })

    it('navigation to exsit path', async () => {
      const router = setupRouter({ logined: true })
      await router.push('/admin')
      expect(router.currentRoute.value.fullPath).toBe('/admin')
      await router.push('/list/basic-list')
      expect(router.currentRoute.value.fullPath).toBe('/list/basic-list')
      router.unmount()
    })

    it('redirect to NotFound when navigation to not exsit path', async () => {
      const router = setupRouter({ logined: true })
      await router.push('/not-exsit-path')
      expect(router.currentRoute.value.name).toBe('FallbackNotFound')
      expect(router.currentRoute.value.query.redirect).toBeUndefined()
      router.unmount()
    })

    it('login and logout', async () => {
      const router = setupRouter({ logined: true })
      await router.push('/list/basic-list?b=2')
      expect(router.currentRoute.value.fullPath).toBe('/list/basic-list?b=2')
      expect(router.getRoutes().length).toBe(8)
      router.setOptions({ logined: false })
      await router.push('/list/basic-list?a=1')
      expect(router.currentRoute.value.name).toBe('Login')
      expect(router.currentRoute.value.query.redirect).toBe('/list/basic-list?a=1')
      await router.push('/login')
      expect(router.currentRoute.value.name).toBe('Login')
      expect(router.currentRoute.value.query.redirect).toBeUndefined()
      router.runPluginsCleanup()
      expect(router.getRoutes().length).toBe(5)
      router.setOptions({ logined: true })
      await router.push('/list/basic-info?b=2')
      expect(router.currentRoute.value.fullPath).toBe('/list/basic-info?b=2')
      expect(router.getRoutes().length).toBe(8)
      router.unmount()
    })
  })
})
