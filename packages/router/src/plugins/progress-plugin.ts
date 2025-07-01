import type { ProRouterPlugin } from '../create-router'
import NProgress from 'nprogress'

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
