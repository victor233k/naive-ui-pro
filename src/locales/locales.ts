import type { Get, Paths } from 'type-fest'
import type { App } from 'vue'
import { has } from 'lodash-es'
import { createI18n } from 'vue-i18n'
import enUS from './en-us'
import zhCN from './zh-cn'

export const Lang = {
  ZH_CN: 'zh-CN',
  EN_US: 'en-US',
} as const

export const i18nLocales = {
  [Lang.ZH_CN]: zhCN,
  [Lang.EN_US]: enUS,
}

export const i18n = createI18n({
  legacy: false,
  locale: Lang.ZH_CN,
  messages: i18nLocales,
  fallbackLocale: Lang.EN_US,
})

export const $t = i18n.global.t

export function setupI18n(app: App) {
  app.use(i18n)
}

export function isI18nKey(key: string): key is I18nKeyPath {
  return has(i18nLocales[i18n.global.locale.value], key)
}

export type LangType = typeof Lang[keyof typeof Lang]
export type I18nKeyPath = Paths<typeof zhCN, { leavesOnly: true }>
export type MaybeI18nKeyPath = I18nKeyPath | (string & {})
export type IsI18nKey<K> = K extends I18nKeyPath ? true : false
export type Translate<K extends MaybeI18nKeyPath> = IsI18nKey<K> extends true
  ? Get<typeof zhCN, K>
  : K
