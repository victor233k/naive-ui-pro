import type { RouteLocationNormalizedGeneric, Router } from 'vue-router'
import type { ProRouterPlugin } from '../plugin'

export function autoRedirectToFirstChild(): ProRouterPlugin {
  return ({ router }) => {
    router.beforeResolve((to) => {
      return tryRedirectToFirstChild(router, to)
    })
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
