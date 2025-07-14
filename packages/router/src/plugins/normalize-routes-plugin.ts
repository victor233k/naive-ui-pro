import type { RouteLocationNormalizedGeneric, Router } from 'vue-router'
import type { ProRouterPlugin } from '../plugin'
import { isString, isSymbol } from 'lodash-es'

export function normalizeRoutesPlugin(): ProRouterPlugin {
  return ({ router }) => {
    router.beforeResolve((to) => {
      return tryRedirectToFirstChild(router, to)
    })

    router.afterEach((to) => {
      tryUpdateComponentName(to)
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

function tryRedirectToFirstChild(router: Router, to: RouteLocationNormalizedGeneric) {
  const currentRoute = to.matched[to.matched.length - 1]
  if (
    !currentRoute.redirect
    && currentRoute.children
    && currentRoute.children.length > 0
  ) {
    const firstChildRoute = currentRoute.children[0]
    const resolved = router.resolve(firstChildRoute)
    return {
      ...resolved,
      replace: true,
    }
  }
}
