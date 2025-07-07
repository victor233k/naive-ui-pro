import type { MaybeRefOrGetter } from '@vueuse/core'
import type { RouteLocationNormalizedGeneric, RouteLocationNormalizedLoadedGeneric, RouteRecordRaw } from 'vue-router'
import type { ProRouterPlugin } from '@pro/router-plugin-system'
import { toValue } from 'vue'

declare module 'vue-router' {
  interface RouteMeta {
    /**
     * 角色列表
     */
    roles?: string[]
    /**
     * 是否忽略权限验证
     */
    ignoreAccess?: boolean
  }
}

interface UserInfo {
  /**
   * 是否已登录
   */
  logined: boolean
}

interface RbacAccessPluginOptions {
  /**
   * 首页路径, 如果登录，会跳转到此路径
   * @default '/home'
   */
  homePath?: MaybeRefOrGetter<string>
  /**
   * 如果校验失败，会跳转到此路径
   * @default '/login'
   */
  redirectToWhenVerifyFailed?: MaybeRefOrGetter<string>
  getUserInfo: () => Promise<UserInfo>
  /**
   * 校验函数，一般用于检查是否登录
   */
  verify: (to: RouteLocationNormalizedGeneric, from: RouteLocationNormalizedLoadedGeneric) => boolean
  /**
   * 获取当前用户角色
   */
  getRoles: (to: RouteLocationNormalizedGeneric, from: RouteLocationNormalizedLoadedGeneric) => Promise<string[]>
  /**
   * 忽略权限验证的路由名称列表
   */
  ignoreAccessRouteNames?: MaybeRefOrGetter<Array<string | symbol>>
  /**
   * 获取路由列表
   */
  getRoutes: () => RouteRecordRaw[] | Promise<RouteRecordRaw[]>
}
export function rbacAccessPlugin({
  verify,
  redirectToWhenVerifyFailed,
  ignoreAccessRouteNames = [],
  getRoles
}: RbacAccessPluginOptions): ProRouterPlugin {
  return ({ router }) => {
    router.beforeEach(async (to, from) => {
      const success = verify(to, from)
      if (!success) {
        // 校验失败但是访问的是忽略权限验证的路由，直接放行
        if (to.meta.ignoreAccess || toValue(ignoreAccessRouteNames).includes(to.name)) {
          return true
        }
        // 校验失败，跳转到指定路径
        return {
          replace: true,
          path: toValue(redirectToWhenVerifyFailed),
          query: {
            redirect: encodeURIComponent(to.fullPath),
          },
        }
      }
      // 获取当前用户角色
      const roles = await getRoles(to, from)
      // 检查是否具有访问权限
      if (roles.some(role => to.meta.roles?.includes(role))) {
        return true
      }
    })
  }
}
