import path from 'node:path'
import vue from '@vitejs/plugin-vue'
import { ProNaiveUIResolver } from 'pro-naive-ui-resolver'
import UnoCSS from 'unocss/vite'
import Components from 'unplugin-vue-components/vite'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const nodeEnv = loadEnv(mode, './').VITE_USER_NODE_ENV
  return {
    define: {
      __DEV__: nodeEnv !== 'production',
    },
    plugins: [
      vue(),
      Components({
        resolvers: [ProNaiveUIResolver()],
      }),
      UnoCSS(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  }
})
