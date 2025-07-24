import { createApp } from 'vue'
import App from './App.vue'
import { prepareCreateApp, prepareMount } from './prepare'

async function bootstrap() {
  await prepareCreateApp()
  const app = createApp(App)
  await prepareMount(app)
  app.mount('#app')
}

bootstrap()
