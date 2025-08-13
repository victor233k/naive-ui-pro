import type { App } from 'vue'
import { dateEnUS as dateEnUSNaive, dateZhCN as dateZhCNNaive } from 'naive-ui'
import { enUS as enUSProNaive, zhCN as zhCNProNaive } from 'pro-naive-ui'
import { createI18n } from 'vue-i18n'
import enUS from './en-us'
import zhCN from './zh-cn'

export const i18nLocales = {
  'zh-CN': zhCN,
  'en-US': enUS,
}

export const proNaiveLocales = {
  'zh-CN': zhCNProNaive,
  'en-US': enUSProNaive,
}

export const naiveDateLocales = {
  'zh-CN': dateZhCNNaive,
  'en-US': dateEnUSNaive,
}

export const i18n = createI18n({
  legacy: false,
  locale: 'zh-CN',
  messages: i18nLocales,
  fallbackLocale: 'en-US',
})

export const $t = i18n.global.t

export function setupI18n(app: App) {
  app.use(i18n)
}
