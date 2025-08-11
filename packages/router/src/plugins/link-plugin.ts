import {
  useRoute,
  useRouter,
  type RouteLocationNormalizedGeneric,
  type Router,
} from 'vue-router'
import type { ProRouterPlugin } from '../plugin'
import {
  computed,
  defineComponent,
  h,
  MaybeRefOrGetter,
  nextTick,
  ref,
  toValue,
} from 'vue'
import { warn } from '../utils/warn'
import { NButton, NResult, NSpin } from 'naive-ui'
import { useTimeoutFn } from '@vueuse/core'
import { isError, toString } from 'lodash-es'

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
    [IFRAME_CONFIG]?: { src: string; timeout: MaybeRefOrGetter<number> }
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
  /**
   * iframe 超时时间，单位：秒
   * @default 10
   */
  iframeTimeout?: MaybeRefOrGetter<number>
}

const IFRAME_CONFIG = Symbol('iframe config')
const IFRAME_CLEANUP_FN = Symbol('iframe cleanup fn')

const BuiltinIframeComponent = /* @__PURE__ */ defineComponent({
  setup() {
    const route = useRoute()
    const { src, timeout } = route.meta[IFRAME_CONFIG] || {}

    if (__DEV__) {
      if (!src) {
        warn('No `src` found in `route.meta[IFRAME_SRC]`!')
      }
    }

    const loading = ref(true)
    const loadError = ref<string>()

    const { stop } = useTimeoutFn(
      () => {
        loading.value && handleLoaded('加载超时，请检查外链是否正确！')
      },
      computed(() => toValue(timeout) * 1e3),
    )

    function handleLoaded(errorMessage?: string) {
      if (!loading.value) return

      stop()
      loading.value = false
      loadError.value = errorMessage
    }

    const router = useRouter()
    function handleReload() {
      router.refresh()
    }

    return () => {
      return h(
        'div',
        {
          class: 'relative w-full h-full',
        },
        [
          h('iframe', {
            class: [
              'size-full border-none overflow-hidden',

              // 避免闪屏
              loading.value || loadError.value
                ? 'opacity-0 pointer-events-none'
                : '',
            ],
            src,
            onLoad() {
              handleLoaded()
            },
            onError(e) {
              handleLoaded(e.message)
            },
          }),

          h(
            NSpin,
            {
              class: 'z-1 absolute inset-0',
              show: loading.value,
            },
            // 没有子元素时 NSpin 更改 show 不会关闭
            () => h('div'),
          ),

          loadError.value &&
            h(
              NResult,
              {
                class: 'z-2 absolute top-25% inset-x-0',
                status: 'error',
                title: '加载失败',
                description: loadError.value,
              },
              {
                footer: () =>
                  h(
                    NButton,
                    {
                      type: 'primary',
                      onClick: handleReload,
                    },
                    '重新加载',
                  ),
              },
            ),
        ],
      )
    }
  },
})

export function linkPlugin({
  openInNewWindow = (url) => window.open(url, '_blank'),
  iframeTimeout = 10,
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

          to.meta[IFRAME_CONFIG] = { src: link, timeout: iframeTimeout }
          to.meta[IFRAME_CLEANUP_FN] = () => {
            components.default = rawDefaultComponent
            to.meta[IFRAME_CONFIG] = undefined
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

function getStorageKey({
  linkMode,
  link,
}: {
  linkMode: LinkMode
  link: string
}) {
  return `__PRO_ROUTER_LINK_PLUGIN__${linkMode}__${link}__`
}
