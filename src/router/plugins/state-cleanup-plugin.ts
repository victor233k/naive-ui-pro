import type { ProRouterPlugin } from '@pro/router'
import { LOGIN_ROUTE_PATH } from '../routes'

/**
 * 当跳转到登录页时，清理数据，这个插件与 admin 强关联，所以不放在 @pro/router 中
 */
export function stateCleanupPlugin(): ProRouterPlugin {
  return ({ router }) => {
    router.afterEach((to) => {
      if (to.path === LOGIN_ROUTE_PATH) {
        // 清理所有插件数据，比如权限路由、缓存的组件等
        router.runPluginsCleanup()
        // 还可以清理其他的数据...
      }
    })
  }
}
