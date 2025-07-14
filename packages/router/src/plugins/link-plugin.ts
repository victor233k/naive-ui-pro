import type { ProRouterPlugin } from '../plugin'
import { isString } from 'lodash-es'

declare module 'vue-router' {
  interface RouteMeta {
    /**
     * 外链跳转地址
     */
    link?: string
  }
}

/**
 * 检查传入的字符串是否为有效的HTTP或HTTPS URL。
 *
 * @param {string} url 要检查的字符串。
 * @return {boolean} 如果字符串是有效的HTTP或HTTPS URL，返回true，否则返回false。
 */
function isHttpUrl(url?: string) {
  if (!url) {
    return false
  }
  // 使用正则表达式测试URL是否以http:// 或 https:// 开头
  const httpRegex = /^https?:\/\/.*$/
  return httpRegex.test(url)
}

export function linkPlugin(): ProRouterPlugin {
  return ({ router }) => {
    router.beforeEach((to) => {
      const link = to.meta?.link
      if (isString(link) && isHttpUrl(link)) {
        window.open(link, '_blank')
        // 阻断原有跳转
        return false
      }
    })
  }
}
