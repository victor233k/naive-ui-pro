import type { ProRouterPlugin } from '../plugin'

declare module 'vue-router' {
  interface RouteMeta {
    /**
     * 外链跳转地址
     */
    link?: string
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
  open = _open,
  isExternalUrl = _isExternalUrl,
}: LinkPluginOptions = {}): ProRouterPlugin {
  return ({ router }) => {
    router.beforeEach((to) => {
      const link = to.meta?.link
      if (isExternalUrl(link)) {
        open(link)
        return false
      }
    })
  }
}

function _open(url: string) {
  window && window.open(url, '_blank')
}

function _isExternalUrl(url?: string) {
  if (!url) {
    return false
  }
  const httpRegex = /^https?:\/\/.*$/
  return httpRegex.test(url)
}
