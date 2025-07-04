import type { ProRouterPlugin } from '../create-router'
import NProgress from 'nprogress'

/**
 * TODO: 考虑一下加载过的页面，是否需要显示进度条
 */
export function progressPlugin(): ProRouterPlugin {
  return {
    name: '@pro/router-plugin-progress',
    beforeEach() {
      NProgress.start()
    },
    afterEach() {
      NProgress.done()
    },
    onError(err) {
      NProgress.done()
      if (__DEV__) {
        console.error(err)
      }
    },
  }
}
