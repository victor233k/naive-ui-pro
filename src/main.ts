import { createApp } from 'vue'
import { setupPinia } from '@/store'
import App from './App.vue'
import { setupRouter } from './router'
import 'nprogress/nprogress.css'
import 'virtual:uno.css'
import './assets/reset.css'

async function bootstrap() {
  const app = createApp(App)
  await setupPinia(app)
  await setupRouter(app)

  app.mount('#app')
}

bootstrap()
