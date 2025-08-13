import type { EventHookOn } from '@vueuse/core'
import type { Merge } from 'type-fest'
import type { Router, RouteRecordRaw } from 'vue-router'
import type { ProRouterPlugin } from '../plugin'
import { createEventHook } from '@vueuse/core'
import { cloneDeep, noop } from 'lodash-es'
import { eachTree, mapTree } from 'pro-composables'

declare module 'vue-router' {
  interface RouteMeta {
    /**
     * 当前路由可以被哪些角色访问，如果为空，则表示所有角色都可以访问，只在前端权限控制模式下有效
     */
    roles?: string[]
  }
}

type RouteName = string | symbol
type MaybePromise<T> = T | Promise<T>

export type RouteRecordRawWithStringComponent = Merge<RouteRecordRaw, {
  component?: string
  children?: RouteRecordRawWithStringComponent[]
}>

type ResolveComponent = (component: string) => NonNullable<RouteRecordRaw['component']>

export interface BaseServiceReturned {
  /**
   * 首页路径，如果登录，会跳转到此路径
   * @default '/home'
   */
  homePath?: string
  /**
   * 登录路径，如果未登录，会跳转到此路径
   * @default '/login'
   */
  loginPath?: string
  /**
   * 添加路由时的父级路由名称，设置后使用 router.addRoute(parentNameForAddRoute,routes)，默认使用 router.addRoute(routes)
   */
  parentNameForAddRoute?: string
  /**
   * 这些路由名称不需要进行权限控制，访问这些路由时不需要登录，如果不设置，则使用传递给 createRouter 的 routes 中的路由名称
   */
  ignoreAccessRouteNames?: RouteName[]
  /**
   * 是否已登录
   */
  logined: boolean
  /**
   * 路由构建完成后回调
   * @param routes 构建后最终的 vue-router 路由
   */
  onRoutesBuilt?: (routes: RouteRecordRaw[]) => void
}

export interface BackendServiceReturned extends BaseServiceReturned {
  /**
   * 权限模式为后端权限控制
   */
  mode: 'backend'
  /**
   * routes 中的组件名称是字符串，外部需要将字符串解析成组件
   */
  resolveComponent: ResolveComponent
  /**
   * 需要动态生成的路由列表
   */
  fetchRoutes: () => MaybePromise<RouteRecordRawWithStringComponent[]>
}

export interface FrontendServiceReturned extends BaseServiceReturned {
  /**
   * 权限模式为前端权限控制
   */
  mode: 'frontend'
  /**
   * 当前用户角色，如果为空，不过滤路由
   * @default []
   */
  roles: string[]
  /**
   * 需要动态生成的路由列表，会根据角色过滤路由
   */
  routes: RouteRecordRaw[]
}

export interface RbacAccessPluginOptions {
  service: () => MaybePromise<BackendServiceReturned | FrontendServiceReturned>
}

let cachedRouteNames: RouteName[] | null = null
let resolvedOptions: Required<BackendServiceReturned | FrontendServiceReturned> = null
async function resolveOptions(
  options: RbacAccessPluginOptions,
  { router, onCleanup }: {
    router: Router
    onCleanup: EventHookOn
  },
): Promise<Required<BackendServiceReturned | FrontendServiceReturned>> {
  if (!resolvedOptions) {
    onCleanup(() => {
      resolvedOptions = null
      cachedRouteNames = null
    })
  }
  const {
    homePath,
    loginPath,
    onRoutesBuilt,
    parentNameForAddRoute,
    ignoreAccessRouteNames,
    ...rest
  } = await options.service()
  resolvedOptions = {
    ...rest,
    homePath: homePath ?? '/home',
    loginPath: loginPath ?? '/login',
    onRoutesBuilt: onRoutesBuilt ?? noop,
    parentNameForAddRoute: parentNameForAddRoute ?? null,
    ignoreAccessRouteNames: ignoreAccessRouteNames ?? (cachedRouteNames ||= getRoutesNames((router.options.routes ?? []) as RouteRecordRaw[])),
  }
  return resolvedOptions
}

let registeredRoutes = false
const removeRouteHandlers: (() => void)[] = []
async function resolveRoutes(
  options: Required<BackendServiceReturned | FrontendServiceReturned>,
  { router, onCleanup }: {
    router: Router
    onCleanup: EventHookOn
  },
) {
  const {
    mode,
    logined,
    parentNameForAddRoute,
  } = options

  if (registeredRoutes || !logined) {
    return
  }

  const finalRoutes = await buildRoutes({
    mode,
    roles: (options as any).roles ?? [],
    routes: (options as any).routes ?? [],
    resolveComponent: (options as any).resolveComponent,
    fetchRoutes: (options as any).fetchRoutes ?? (() => []),
  })

  options.onRoutesBuilt(finalRoutes)

  finalRoutes.forEach((route) => {
    removeRouteHandlers.push(
      parentNameForAddRoute
        ? router.addRoute(parentNameForAddRoute, route)
        : router.addRoute(route),
    )
  })

  registeredRoutes = true

  onCleanup(() => {
    registeredRoutes = false
    removeRouteHandlers.forEach(removeRoute => removeRoute())
    removeRouteHandlers.length = 0
  })

  return registeredRoutes
}

export function rbacAccessPlugin(options: RbacAccessPluginOptions): ProRouterPlugin {
  return ({ router, onUnmount }) => {
    const { on: onCleanup, trigger: cleanup } = createEventHook()

    router.beforeEach(async (to) => {
      const resolvedOptions = await resolveOptions(options, {
        router,
        onCleanup,
      })

      const shouldRedirect = await resolveRoutes(resolvedOptions, {
        router,
        onCleanup,
      })

      if (shouldRedirect) {
        return {
          path: to.path,
          replace: true,
          query: to.query,
        }
      }

      const {
        logined,
        homePath,
        loginPath,
        ignoreAccessRouteNames,
      } = resolvedOptions

      // 已登录跳转 login 页面，重定向到 redirect 参数或者 homePath
      if (logined && to.path === loginPath) {
        const path = to.query.redirect ?? homePath
        return path as string
      }

      // 如果是不需要鉴权的路由则放行
      if (ignoreAccessRouteNames.includes(to.name)) {
        return
      }

      // 未登录重定向到登录页
      if (!logined) {
        return {
          path: loginPath,
          query: {
            redirect: to.fullPath,
          },
        }
      }
    })

    onUnmount(() => {
      cleanup()
    })

    return {
      onCleanup: cleanup,
    }
  }
}

function getRoutesNames(routes: RouteRecordRaw[]) {
  const routeNames: RouteName[] = []
  eachTree(routes, (route) => {
    if (route.name) {
      if (!routeNames.includes(route.name)) {
        routeNames.push(route.name)
      }
    }
  }, 'children')
  return routeNames
}

function buildRoutes(options: {
  roles: string[]
  routes: RouteRecordRaw[]
  mode: 'frontend' | 'backend'
  resolveComponent?: ResolveComponent | void
  fetchRoutes: () => MaybePromise<RouteRecordRawWithStringComponent[]>
}) {
  return options.mode === 'frontend'
    ? buildRoutesByFrontend(
        options.routes,
        options.roles,
      )
    : buildRoutesByBackend(
        options.fetchRoutes,
        options.resolveComponent as ResolveComponent,
      )
}

function buildRoutesByFrontend(
  routes: RouteRecordRaw[],
  roles: string[],
): RouteRecordRaw[] {
  routes = cloneDeep(routes)
  const hasAuth = (route: RouteRecordRaw) => {
    const routeRoles = route.meta?.roles ?? []
    if (routeRoles.length <= 0) {
      // 如果没有设置 roles，则表示所有角色都可以访问
      return true
    }
    return roles.some(role => routeRoles.includes(role))
  }
  const filterRoutes = (routes: RouteRecordRaw[]) => {
    return routes.filter((route) => {
      if (hasAuth(route)) {
        if (route.children) {
          route.children = filterRoutes(route.children)
        }
        return true
      }
      return false
    })
  }
  return filterRoutes(routes)
}

async function buildRoutesByBackend(
  fetchRoutes: () => MaybePromise<RouteRecordRawWithStringComponent[]>,
  resolveComponent: ResolveComponent,
) {
  let routes: RouteRecordRawWithStringComponent[] = []
  try {
    routes = await fetchRoutes()
  }
  catch (error) {
    routes = []
    console.error(error)
  }
  return mapTree(routes, (route) => {
    if (!route.component) {
      return route
    }
    return {
      ...route,
      component: resolveComponent(route.component),
    }
  }, 'children') as RouteRecordRaw[]
}
