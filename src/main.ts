import { createProdMockServer } from 'vite-plugin-mock/client'
import { createApp } from 'vue'
import mockList from '../mock/index'
import App from './App.vue'
import { prepareCreateApp, prepareMount } from './prepare'

async function bootstrap() {
  if (!__DEV__) {
    createProdMockServer(mockList)
  }
  prepareCreateApp()
  const app = createApp(App)
  await prepareMount(app)
  app.mount('#app')
}

bootstrap()
