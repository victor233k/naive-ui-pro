import type { App } from 'vue'
import { createPinia } from 'pinia'
import { preferencePlugin } from './plugins/preference-plugin'

export function setupPinia(app: App) {
  const pinia = createPinia()
  pinia.use(preferencePlugin)
  app.use(pinia)
}
