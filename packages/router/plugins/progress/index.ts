export function progressPlugin() {
  router.beforeEach((to, from, next) => {
    // Start the progress bar
    if (window.NProgress) {
      window.NProgress.start()
    }
    next()
  })

  router.afterEach(() => {
    // Complete the progress bar
    if (window.NProgress) {
      window.NProgress.done()
    }
  })

  router.onError((error) => {
    console.error('Router error:', error)
    if (window.NProgress) {
      window.NProgress.done()
    }
  })
}
