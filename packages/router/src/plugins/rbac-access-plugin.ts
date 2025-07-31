import type { EventHookOn } from '@vueuse/core'
import type { Merge } from 'type-fest'
import type { Router, RouteRecordRaw } from 'vue-router'
import type { ProRouterPlugin } from '../plugin'
import { createEventHook } from '@vueuse/core'
import { cloneDeep } from 'lodash-es'
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

type RouteRecordRawStringComponent = Merge<RouteRecordRaw, {
  component?: string
  children?: RouteRecordRawStringComponent[]
}>

type ResolveComponent = (component: string) => NonNullable<RouteRecordRaw['component']>

interface RbacAccessPluginBaseServiceReturned {
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
}

type RbacAccessPluginService<Returned extends Record<string, any>> = () => MaybePromise<Merge<
    Returned,
    RbacAccessPluginBaseServiceReturned
>>

type RbacAccessPluginFrontendService = RbacAccessPluginService<{
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
}>

type RbacAccessPluginBackendService = RbacAccessPluginService<{
  /**
   * 权限模式为后端权限控制
   */
  mode: 'backend'
  /**
   * 需要动态生成的路由列表
   */
  routes: RouteRecordRawStringComponent[]
  /**
   * routes 中的组件名称是字符串，外部需要将字符串解析成组件
   */
  resolveComponent: ResolveComponent
}>

export type RbacAccessPluginServiceReturned
= | Awaited<ReturnType<RbacAccessPluginBackendService>>
  | Awaited<ReturnType<RbacAccessPluginFrontendService>>

export interface RbacAccessPluginOptions {
  service: RbacAccessPluginBackendService | RbacAccessPluginFrontendService
}

let cachedRouteNames: RouteName[] | null = null
let resolvedOptions: Required<RbacAccessPluginServiceReturned> = null
async function resolveOptions(
  options: RbacAccessPluginOptions,
  { router, onCleanup }: {
    router: Router
    onCleanup: EventHookOn
  },
): Promise<Required<RbacAccessPluginServiceReturned>> {
  if (!resolvedOptions) {
    onCleanup(() => {
      resolvedOptions = null
      cachedRouteNames = null
    })
  }
  const {
    homePath,
    loginPath,
    parentNameForAddRoute,
    ignoreAccessRouteNames,
    ...rest
  } = await options.service()
  resolvedOptions = {
    ...rest,
    homePath: homePath ?? '/home',
    loginPath: loginPath ?? '/login',
    parentNameForAddRoute: parentNameForAddRoute ?? null,
    ignoreAccessRouteNames: ignoreAccessRouteNames ?? (cachedRouteNames ||= getRoutesNames((router.options.routes ?? []) as RouteRecordRaw[])),
  }
  return resolvedOptions
}

let registeredRoutes = false
const removeRouteHandlers: (() => void)[] = []
function resolveRoutes(
  options: Required<RbacAccessPluginServiceReturned>,
  { router, onCleanup }: {
    router: Router
    onCleanup: EventHookOn
  },
) {
  const {
    mode,
    logined,
    routes,
    parentNameForAddRoute,
  } = options

  if (registeredRoutes || !logined) {
    return
  }

  const finalRoutes = buildRoutes({
    mode,
    routes,
    roles: (options as any).roles,
    resolveComponent: (options as any).resolveComponent,
  })

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

      const shouldRedirect = resolveRoutes(resolvedOptions, {
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
  mode: 'frontend' | 'backend'
  roles?: string[] | void
  resolveComponent?: ResolveComponent | void
  routes: Array<RouteRecordRaw | RouteRecordRawStringComponent>
}) {
  return options.mode === 'frontend'
    ? buildRoutesByFrontend(
        options.routes as RouteRecordRaw[],
        options.roles as string[],
      )
    : buildRoutesByBackend(
        options.routes as RouteRecordRawStringComponent[],
        options.resolveComponent as ResolveComponent,
      )
}

function buildRoutesByFrontend(
  routes: RouteRecordRaw[],
  roles: string[],
): RouteRecordRaw[] {
  routes = cloneDeep(routes)
  const hasAuth = (route: RouteRecordRaw) => {
    const routeRoles = route.meta.roles ?? []
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

function buildRoutesByBackend(
  routes: RouteRecordRawStringComponent[],
  resolveComponent: ResolveComponent,
) {
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
