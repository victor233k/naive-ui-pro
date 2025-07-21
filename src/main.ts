import { createProdMockServer } from 'vite-plugin-mock/client'
import { createApp } from 'vue'
import { setupPinia } from '@/store'
import mockList from '../mock/index'
import App from './App.vue'
import { setupRouter } from './router'
import 'virtual:uno.css'
import './assets/reset.css'

async function bootstrap() {
  if (!__DEV__) {
    createProdMockServer(mockList)
  }
  const app = createApp(App)
  await setupPinia(app)
  await setupRouter(app)
  app.mount('#app')
}

bootstrap()
