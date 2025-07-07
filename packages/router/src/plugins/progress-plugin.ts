import type { ProRouterPlugin } from '../plugin'
import NProgress from 'nprogress'

/**
 * TODO: 考虑一下加载过的页面，是否需要显示进度条
 */
export function progressPlugin(): ProRouterPlugin {
  return ({ router }) => {
    router.beforeEach(() => {
      NProgress.start()
    })

    router.afterEach(() => {
      NProgress.done()
    })

    router.onError((err) => {
      NProgress.done()
      if (__DEV__) {
        console.error(err)
      }
    })
  }
}
