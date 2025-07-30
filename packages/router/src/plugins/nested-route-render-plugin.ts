import type { ProRouterPlugin } from '../plugin'
import { inject, toValue } from 'vue'
import { viewDepthKey } from 'vue-router'

export function nestedRouteRenderPlugin(): ProRouterPlugin {
  return ({ router, runWithApp }) => {
    router.resolveNestedRoute = () => {
      let injectedViewDepth: number
      runWithApp((app) => {
        app.runWithContext(() => {
          injectedViewDepth = toValue(inject(viewDepthKey, 0))
        })
      })

      const route = router.currentRoute.value
      route.matched = route.matched.map((item, index, arr) => {
        // 只有在当前路由的深度大于注入的深度时，才需要忽略非当前路由的组件属性
        if (index > injectedViewDepth && index !== arr.length - 1) {
          // 这里必须进行浅拷贝，否则会在进入子级路由后无法再返回父级路由
          item = { ...item, components: undefined }
        }
        return item
      })

      return route
    }
  }
}

declare module 'vue-router' {
  interface Router {
    resolveNestedRoute: () => RouteLocationNormalizedLoaded
  }
}
