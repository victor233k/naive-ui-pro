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
    router.beforeEach((to) => {
      const { link, openInNewWindow = false } = to.meta || {}
      if (isExternalUrl(link)) {
        open(link)
        return false
      }
      else if (openInNewWindow && !to.query.opened) {
        open(buildUrl(to.fullPath, true))
        return false
      }
    })
  }
}

function builtinOpen(url: string) {
  window && window.open(url, '_blank')
}

function builtinIsExternalUrl(url?: string) {
  if (!url) {
    return false
  }
  const httpRegex = /^https?:\/\/.*$/
  return httpRegex.test(url)
}

function buildUrl(path: string, markOpened = false) {
  const { hash, origin } = window.location || {}
  let fullPath = path.startsWith('/') ? path : `/${path}`
  if (markOpened) {
    // 添加opened标记，避免死循环
    fullPath += fullPath.includes('?') ? '&opened=true' : '?opened=true'
  }
  const url = `${origin}${hash ? '/#' : ''}${fullPath}`
  return url
}
