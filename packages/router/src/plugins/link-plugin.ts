import type { ProRouterPlugin } from '../plugin'

declare module 'vue-router' {
  interface RouteMeta {
    /**
     * 外链跳转地址
     */
    link?: string
    /**
     * 是否在新窗口打开系统内部菜单
     */
    openInNewWindow?: boolean
  }
}

interface LinkPluginOptions {
  /**
   * 打开外部链接
   */
  open?: (url: string) => void
  /**
   * 是否为外部链接
   */
  isExternalUrl?: (url?: string) => boolean
}

export function linkPlugin({
  open = builtinOpen,
  isExternalUrl = builtinIsExternalUrl,
}: LinkPluginOptions = {}): ProRouterPlugin {
  return ({ router }) => {
    router.beforeEach((to, from) => {
      const { link, openInNewWindow = false } = to.meta ?? {}
      if (isExternalUrl(link)) {
        open(link)
        return false
      }
      if (openInNewWindow) {
        const pathKey = `__PRO_ROUTER_LINK_PLUGIN_OPEN_IN_NEW_WINDOW_${to.fullPath.toUpperCase()}__`
        if (window.localStorage.getItem(pathKey)) {
          window.localStorage.removeItem(pathKey)
          return
        }
        window.localStorage.setItem(pathKey, 'true')
        const finalUrl = router.options.history.createHref(to.fullPath)
        open(finalUrl)
        return from
      }
    })
  }
}

function builtinOpen(url: string) {
  window.open(url, '_blank')
}

function builtinIsExternalUrl(url?: string) {
  if (!url) {
    return false
  }
  const httpRegex = /^https?:\/\/.*$/
  return httpRegex.test(url)
}
