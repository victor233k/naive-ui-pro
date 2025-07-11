import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [
    vue(),
  ],
  test: {
    environment: 'happy-dom',
  },
  define: {
    __DEV__: JSON.stringify(true),
  },
  resolve: {
    dedupe: [
      'vue',
    ],
  },
})
