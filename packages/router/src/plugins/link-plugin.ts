import {
  useRoute,
  type RouteLocationNormalizedGeneric,
  type Router,
} from 'vue-router'
import type { ProRouterPlugin } from '../plugin'
import { defineComponent, h } from 'vue'
import { warn } from '../utils/warn'

declare module 'vue-router' {
  interface RouteMeta {
    /**
     * 外链跳转地址
     * - string: 外链地址
     * - boolean: 当前路由作为外链地址
     */
    link?: string | boolean
    /**
     * 外链跳转方式
     * @default 'newWindow'
     */
    linkMode?: LinkMode
    /**
     * @internal
     */
    [IFRAME_SRC]?: string
    /**
     * @internal
     */
    [IFRAME_CLEANUP_FN]?: () => void
  }
}

export type LinkMode = 'newWindow' | 'iframe' | 'custom'

export interface LinkPluginOptions {
  /**
   * 自定义在新窗口打开外链的方式
   * @default
   * ```ts
   * (url) => window.open(url, '_blank')
   * ```
   */
  openInNewWindow?: (url: string) => void
}

const IFRAME_SRC = Symbol('iframe src')
const IFRAME_CLEANUP_FN = Symbol('iframe cleanup fn')

const BuiltinIframeComponent = /* @__PURE__ */ defineComponent({
  setup() {
    const route = useRoute()
    const src = route.meta[IFRAME_SRC]
    route.meta[IFRAME_CLEANUP_FN]?.()

    if (__DEV__) {
      if (!src) {
        warn('No `src` found in `route.meta[IFRAME_SRC]`!')
      }
    }

    return () => {
      return h('iframe', {
        class: 'relative w-full h-full border-none overflow-hidden',
        src: src,
      })
    }
  },
})

export function linkPlugin({
  openInNewWindow = builtinOpenInNewWindow,
}: LinkPluginOptions = {}): ProRouterPlugin {
  return ({ router }) => {
    router.beforeEach((to, from) => {
      if (to.meta[IFRAME_CLEANUP_FN]) {
        to.meta[IFRAME_CLEANUP_FN]()
      }

      const resolved = resolveLink(to, router)
      if (!resolved) return

      const { linkMode = 'newWindow' } = to.meta
      const { link, isLinkRoute } = resolved

      if (isLinkRoute) {
        const key = getStorageKey({ linkMode, link })
        if (localStorage.getItem(key)) {
          localStorage.removeItem(key)
          return
        }
        localStorage.setItem(key, 'true')
      }

      switch (linkMode) {
        case 'newWindow': {
          openInNewWindow(link)
          return { ...from, replace: true }
        }

        case 'iframe': {
          const components = to.matched[to.matched.length - 1].components
          const rawDefaultComponent = components.default
          components.default = BuiltinIframeComponent

          to.meta[IFRAME_SRC] = link
          to.meta[IFRAME_CLEANUP_FN] = () => {
            components.default = rawDefaultComponent
            to.meta[IFRAME_SRC] = undefined
            to.meta[IFRAME_CLEANUP_FN] = undefined
          }
        }
      }
    })
  }
}

function resolveLink(
  route: RouteLocationNormalizedGeneric,
  router: Router,
): { link: string; isLinkRoute: boolean } | undefined {
  const link = route.meta.link
  if (!link) return

  return {
    link:
      link === true ? router.options.history.createHref(route.fullPath) : link,
    isLinkRoute: link === true,
  }
}

function builtinOpenInNewWindow(url: string) {
  window.open(url, '_blank')
}

function getStorageKey({
  linkMode,
  link,
}: {
  linkMode: LinkMode
  link: string
}) {
  return `__PRO_ROUTER_LINK_PLUGIN__${linkMode}__${link}__`
}
