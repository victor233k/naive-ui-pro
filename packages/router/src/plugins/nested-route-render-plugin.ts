import type { ProRouterPlugin } from '../plugin'
import { inject, toValue } from 'vue'
import { viewDepthKey } from 'vue-router'

declare module 'vue-router' {
  interface Router {
    /**
     * 解析嵌套路由，传递给 router-view 的 route prop
     */
    resolveNestedRoute: () => RouteLocationNormalizedLoaded
  }
}

export function nestedRouteRenderPlugin(): ProRouterPlugin {
  return ({ router, onUnmount, runWithApp }) => {
    router.resolveNestedRoute = () => {
      let injectedViewDepth: number
      runWithApp((app) => {
        app.runWithContext(() => {
          injectedViewDepth = toValue(inject(viewDepthKey, 0))
        })
      })

      const route = router.currentRoute.value
      return {
        ...route,
        matched: route.matched.map((item, index, arr) => {
          if (index > injectedViewDepth && index !== arr.length - 1) {
            return {
              ...item,
              components: undefined,
            }
          }
          return item
        }),
      }
    }

    onUnmount(() => {
      delete router.resolveNestedRoute
    })
  }
}
