import type { RouteLocationNormalizedGeneric } from 'vue-router'
import type { ProRouterPlugin } from '../plugin'
import { normalizeRouteName } from '../utils/normalize-route-name'

export function normalizeRoutesPlugin(): ProRouterPlugin {
  return ({ router }) => {
    router.afterEach((to) => {
      tryUpdateComponentName(to)
    })
  }
}

function tryUpdateComponentName(to: RouteLocationNormalizedGeneric) {
  const currentRoute = to.matched[to.matched.length - 1]
  const currentRouteName = currentRoute.name
  if (!currentRoute.components) {
    return
  }
  const currentRouteComponentName = currentRoute.components.default.name
  if (__DEV__) {
    if (
      currentRouteName
      && currentRouteComponentName
      && currentRouteName !== currentRouteComponentName
    ) {
      console.warn(`[@pro/router] Route name "${normalizeRouteName(currentRouteName)}" is not equal to component name "${currentRouteComponentName}"`)
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
    currentRoute.components.default.__name = normalizeRouteName(currentRouteName)
  }
}
