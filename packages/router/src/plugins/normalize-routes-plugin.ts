import type { RouteLocationNormalizedGeneric } from 'vue-router'
import type { ProRouterPlugin } from '../plugin'
import { isString, isSymbol } from 'lodash-es'

export function normalizeRoutesPlugin(): ProRouterPlugin {
  return ({ router }) => {
    router.afterEach((to) => {
      tryUpdateComponentName(to)
      tryUpdateRouteRedirect(to)
    })
  }
}

function tryUpdateComponentName(to: RouteLocationNormalizedGeneric) {
  const currentRoute = to.matched[to.matched.length - 1]
  const currentRouteName = currentRoute.name
  const currentRouteComponentName = currentRoute.components.default.name

  if (__DEV__) {
    if (
      isString(currentRouteName)
      && currentRouteComponentName
      && currentRouteName !== currentRouteComponentName
    ) {
      console.warn(`[@pro/router] Route name "${currentRouteName}" is not equal to component name "${currentRouteComponentName}"`)
      return
    }

    if (
      !currentRouteName
      && currentRouteComponentName
    ) {
      console.log(`[@pro/router] Route name is not set, maybe you should set it to "${currentRouteComponentName}"`)
      return
    }
  }

  if (
    currentRouteName
    && !currentRouteComponentName
  ) {
    // eslint-disable-next-line ts/ban-ts-comment
    // @ts-expect-error
    currentRoute.components.default.__name = isSymbol(currentRouteName)
      ? currentRouteName.toString()
      : currentRouteName
  }
}

function tryUpdateRouteRedirect(to: RouteLocationNormalizedGeneric) {
  // const currentRoute = to.matched[to.matched.length - 1]
  // const currentRouteRedirect = currentRoute.redirect

  // if (currentRouteRedirect) {
  //   currentRoute.redirect = currentRouteRedirect
  // }
}

/**
 * createRouter({
 *  ...
 *  plugin:[
 *    normalizePlugin() // 标准化路由插件
      keepAlivePlugin() // 路由缓存插件
      documentTitlePlugin() // 设置 title 插件
      breadcrumbPlugin() // 面包屑插件，将当前路由结构化成面包屑数据
      progressPlugin() // 进度条插件
      rbacAccessPlugin() // 权限插件
      linkPlugin() // 路由跳转插件，支持外链跳转
      menusPlugin() // 菜单插件，将路由表转换成菜单数据
      transitionPlugin() // 路由过渡插件
      tabsPlugin() // 标签页插件
 *  ]
 * })
 */
