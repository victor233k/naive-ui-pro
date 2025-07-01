import type { Plugin } from '../create-router'
import NProgress from 'nprogress'

export function progressPlugin(): Plugin {
  return {
    name: 'progress',
    beforeEach() {
      NProgress.start()
    },
    afterEach() {
      NProgress.done()
    },
    onError(err) {
      NProgress.done()
      console.warn('路由错误', err)
    },
  }
}
