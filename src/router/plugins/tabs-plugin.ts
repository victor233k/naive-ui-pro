import type { ProRouterPlugin } from '@pro/router'
import { ROOT_ROUTE_NAME } from '../routes'

/**
 * tabs 相关处理插件，这个插件与 admin 强关联，所以不放在 @pro/router 中
 */
export function tabsPlugin(): ProRouterPlugin {
  return ({ router }) => {
    const {
      routes,
      guards,
    } = router.visitedRoutesPlugin

    // 如果不是 layout 页面中的路由，则跳过添加
    guards.beforeAdd((route) => {
      if (route.matched[0].name !== ROOT_ROUTE_NAME) {
        return false
      }
      return route
    })

    // 如果当前关闭的标签页是已固定的，则阻止关闭
    guards.beforeRemove((index) => {
      if (routes[index]?.meta?.fixedInTabs) {
        return false
      }
      return index
    })
  }
}
