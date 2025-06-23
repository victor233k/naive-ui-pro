import path from 'node:path'
import vue from '@vitejs/plugin-vue'
import { ProNaiveUIResolver } from 'pro-naive-ui-resolver'
import UnoCSS from 'unocss/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html'
import { preferenceConfig } from './preference'

export default defineConfig({
  plugins: [
    vue(),
    createHtmlPlugin({
      inject: {
        data: {
          title: preferenceConfig.title,
          primaryColor: preferenceConfig.theme.primaryColor,
        },
      },
    }),
    Components({
      resolvers: [
        NaiveUiResolver(),
        ProNaiveUIResolver(),
      ],
    }),
    UnoCSS(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@root': path.resolve(__dirname, './'),
    },
  },
})
