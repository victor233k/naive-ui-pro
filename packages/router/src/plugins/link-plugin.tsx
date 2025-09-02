import type { VNodeChild } from 'vue'
import type { RouteLocationNormalizedGeneric, Router } from 'vue-router'
import type { ProRouterPlugin } from '../plugin'
import { defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import { warn } from '../utils/warn'

const IFRAME_CONFIG = Symbol(
  __DEV__
    ? 'iframe config'
    : ``,
)
const IFRAME_CLEANUP = Symbol(
  __DEV__
    ? 'iframe cleanup fn'
    : ``,
)

declare module 'vue-router' {
  interface RouteMeta {
    /**
     * 外链跳转地址
     * - string: 外链地址
     * - true: 当前路由作为外链地址
     */
    link?: string | true
    /**
     * 外链跳转方式
     * @default 'newWindow'
     */
    linkMode?: LinkMode
    /**
     * @internal
     */

    [IFRAME_CONFIG]?: {
      src: string
      renderIframe: (url: string) => VNodeChild
    }
    /**
     * @internal
     */

    [IFRAME_CLEANUP]?: () => void
  }
}

type LinkMode = 'newWindow' | 'iframe'

export interface LinkPluginOptions {
  /**
   * 自定义在新窗口打开外链的方式
   * @default
   * ```ts
   * (url) => window.open(url, '_blank')
   * ```
   */
  openInNewWindow?: (url: string) => void
  /**
   * 自定义 iframe 渲染方式
   * @default
   * ```ts
   * (url) => <iframe
        class="size-full border-none overflow-hidden"
        src={url}
      >
      </iframe>
   * ```
   */
  renderIframe?: (url: string) => VNodeChild
}

const BuiltinIframeComponent = /* @__PURE__ */ defineComponent({
  setup() {
    const route = useRoute()
    const { src, renderIframe } = route.meta?.[IFRAME_CONFIG] ?? {}

    if (__DEV__) {
      if (!src) {
        warn(`'src' not found in 'route.meta[IFRAME_CONFIG]'!`)
      }
      if (!renderIframe) {
        warn(`'renderIframe' not found in 'route.meta[IFRAME_CONFIG]'!`)
      }
    }

    return {
      src,
      renderIframe,
    }
  },
  render() {
    return this.renderIframe(this.src)
  },
})

export function linkPlugin({
  openInNewWindow = url => (
    window.open(url, '_blank')
  ),
  renderIframe = url => (
    <iframe
      class="size-full border-none overflow-hidden"
      src={url}
    />
  ),
}: LinkPluginOptions = {}): ProRouterPlugin {
  return ({ router }) => {
    router.beforeEach((to, from) => {
      if (to.meta[IFRAME_CLEANUP]) {
        to.meta[IFRAME_CLEANUP]()
      }
      const finalLink = resolveLink(to, router)
      if (!finalLink) {
        return
      }
      const linkMode = to.meta.linkMode ?? 'newWindow'
      const usingRoutePathAsLink = to.meta.link === true
      if (usingRoutePathAsLink) {
        // 当路由 path 作为 link 时，防止陷入死循环
        const key = buildStorageKey(finalLink, linkMode)
        if (localStorage.getItem(key)) {
          localStorage.removeItem(key)
          return
        }
        localStorage.setItem(key, 'true')
      }

      switch (linkMode) {
        case 'newWindow': {
          openInNewWindow(finalLink)
          return { ...from, replace: true }
        }
        case 'iframe': {
          const namespace = 'default'
          const components = to.matched[to.matched.length - 1].components
          const rawComponent = components[namespace]
          components[namespace] = BuiltinIframeComponent

          to.meta[IFRAME_CONFIG] = { src: finalLink, renderIframe }
          to.meta[IFRAME_CLEANUP] = () => {
            components[namespace] = rawComponent
            to.meta[IFRAME_CONFIG] = undefined
            to.meta[IFRAME_CLEANUP] = undefined
          }
        }
      }
    })
  }
}

function resolveLink(
  route: RouteLocationNormalizedGeneric,
  router: Router,
) {
  const link = route.meta.link
  return link === true
    ? router.options.history.createHref(route.fullPath)
    : link
}

function buildStorageKey(link: string, linkMode: LinkMode) {
  return `__PRO_ROUTER_LINK_PLUGIN__${linkMode}__${link}__`
}
