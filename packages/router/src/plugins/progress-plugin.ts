import type { ProRouterPlugin } from '../plugin'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

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
