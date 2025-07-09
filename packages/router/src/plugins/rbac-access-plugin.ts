import type { Merge } from 'type-fest'
import type { RouteLocationNormalized, RouteLocationNormalizedLoaded, Router, RouteRecordRaw } from 'vue-router'
import type { ProRouterPlugin } from '../plugin'
import { cloneDeep, isString } from 'lodash-es'
import { eachTree, mapTree } from 'pro-composables'

declare module 'vue-router' {
  interface RouteMeta {
    /**
     * 当前路由可以被哪些角色访问，如果为空，则表示所有角色都可以访问，只在前端权限控制模式下有效
     */
    roles?: string[]
  }
}

type MaybePromise<T> = T | Promise<T>

type RouteRecordRawStringComponent = Merge<RouteRecordRaw, {
  component?: string
  children?: RouteRecordRawStringComponent[]
}>

type ResolveComponent = (routeRecord: RouteRecordRawStringComponent) => Exclude<RouteRecordRaw['component'], void>

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
   * 是否已登录
   */
  logined: boolean
}

type RbacAccessPluginService<Returned extends Record<string, any>> = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalizedLoaded) => MaybePromise<Merge<
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

interface RbacAccessPluginOptions {
  service: RbacAccessPluginBackendService | RbacAccessPluginFrontendService
}

export function rbacAccessPlugin({
  service,
}: RbacAccessPluginOptions): ProRouterPlugin {
  return ({ router, onUnmount }) => {
    // 是否已经注册过路由
    let registeredRoutes = false
    // 移除路由的函数列表
    const removeRouteHandlers: (() => void)[] = []
    // 静态路由列表名称集合
    const staticRouteNames = getStaticRouteNames(router)
    // 缓存服务结果，避免重复调用
    let cachedServiceResult: Awaited<ReturnType<RbacAccessPluginOptions['service']>> | null = null

    function cleanup() {
      registeredRoutes = false
      cachedServiceResult = null
      removeRouteHandlers.forEach(removeRoute => removeRoute())
      removeRouteHandlers.length = 0
    }

    router.beforeEach(async (to, from) => {
      if (!cachedServiceResult) {
        cachedServiceResult = await service(to, from)
      }

      const {
        mode,
        routes,
        logined,
        homePath = '/home',
        loginPath = '/login',
      } = cachedServiceResult

      // 访问的是静态路由，不需要拦截
      if (staticRouteNames.has(to.name as string)) {
        if (logined && to.path === loginPath) {
          // 如果已登录且访问的是登录页，重定向到 redirect 参数或者 homePath
          return {
            path: (to.query.redirect as string) ?? homePath,
          }
        }
        return
      }

      if (!logined) {
        // 如果未登录且访问的不是登录页，重定向到登录页
        if (to.path !== loginPath) {
          return {
            path: loginPath,
            replace: true,
            query: {
              redirect: to.fullPath, // 方便登录后重定向到当前访问的路径
            },
          }
        }
        return to
      }

      if (registeredRoutes) {
        return
      }

      const finalRoutes = buildRoutes({
        mode,
        routes,
        roles: (cachedServiceResult as any).roles,
        resolveComponent: (cachedServiceResult as any).resolveComponent,
      })

      if (finalRoutes.length > 0) {
        // 动态注册路由
        finalRoutes.forEach((route) => {
          removeRouteHandlers.push(router.addRoute(route))
        })
        registeredRoutes = true
      }

      return {
        ...to,
        replace: true,
      }
    })

    router.afterEach((to) => {
      if (cachedServiceResult && to.path === cachedServiceResult.loginPath) {
        cleanup()
      }
    })

    onUnmount(() => {
      cleanup()
    })
  }
}

function getStaticRouteNames(router: Router) {
  const routeNames: Set<string> = new Set()
  const routes = (router.options.routes ?? []) as RouteRecordRaw[]
  eachTree(routes, (route) => {
    if (isString(route.name) && route.name.length > 0) {
      routeNames.add(route.name)
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
  const hasAuth = (route:RouteRecordRaw) => {
    const routeRoles = route.meta.roles ?? []
    if(routeRoles.length <= 0){
      // 如果没有设置 roles，则表示所有角色都可以访问
      return true
    }
    return roles.some(role => routeRoles.includes(role))
  }
  const filterRoutes = (routes: RouteRecordRaw[]) => {
    return routes.filter((route) => {
      if(hasAuth(route)){
        if(route.children){
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
    return {
      ...route,
      component: resolveComponent(route),
    }
  }, 'children') as RouteRecordRaw[]
}
