import type { App } from 'vue'
import { createWebHistory, type Router } from 'vue-router'
// import { useRouteKeepAliveStore } from '@/store'
import { createRouter } from './composables/create-router'
import { documentTitlePlugin } from './plugins/documentTitlePlugin'
import { progressPlugin } from './plugins/progressPlugin'
import { routesKeepAlivePlugin } from './plugins/routesKeepAlivePlugin'
import { routes } from './routes'

export let router = null as unknown as Router
export async function setupRouter(app: App) {
  router = createRouter({
    history: createWebHistory(),
    routes,
    plugins: [
      progressPlugin(),
      documentTitlePlugin({
        template: (title, ctx) => {
          const { to, from } = ctx
          return `${title}从${from.path}到${to.path} - admain`
        },
      }),
      routesKeepAlivePlugin(),
    ],
  })
  app.use(router)
}
