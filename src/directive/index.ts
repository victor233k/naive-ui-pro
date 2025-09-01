import type { App } from 'vue'
import vLoading from './loading'

export function setupDirective(app: App) {
  app.directive('loading', vLoading)
}
