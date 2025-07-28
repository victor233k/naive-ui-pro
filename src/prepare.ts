import type { App } from 'vue'
import { preferenceConfig } from '@root/preference'
import { merge } from 'lodash-es'
import { setupRouter } from './router'
import { setupPinia } from './store'
import 'virtual:uno.css'
import './assets/reset.css'

export async function prepareCreateApp() {
  setupAppLoading()
}

export async function prepareMount(app: App) {
  await setupPinia(app)
  await setupRouter(app)
}

function setupAppLoading() {
  const cachePreference = localStorage.getItem('preference')
  const finalPreference: typeof preferenceConfig = cachePreference
    ? merge(preferenceConfig, JSON.parse(cachePreference))
    : preferenceConfig
  const { title } = finalPreference.app
  const { mode, primaryColor } = finalPreference.theme
  if (mode === 'dark') {
    document.documentElement.classList.add('dark')
  }
  const loadingHtml = `
    <div class="fixed inset-0 flex flex-col gap-12px justify-center items-center bg-#f7fafc dark:bg-#121212">
      <style>
        .spin {
          width: 50px;
          aspect-ratio: 1;
          --_c: no-repeat radial-gradient(farthest-side, ${primaryColor} 92%, #0000);
          background:
            var(--_c) top,
            var(--_c) left,
            var(--_c) right,
            var(--_c) bottom;
          background-size: 12px 12px;
          animation: spin 1s infinite;
        }
        @keyframes spin {
          to {
            transform: rotate(.5turn)
          }
        }
      </style>
      <div class="spin"></div>
      <div class="text-28px font-bold dark:c-#fff">${title}</div>
    </div>
  `
  const app = document.querySelector('#app')
  if (app) {
    app.innerHTML = loadingHtml
  }
}
