declare module 'vue-router' {
  interface RouteMeta {
    // title 对应语言包中的 key
    titleI18nKey?: I18nKeyPath
    /**
     * 是否固定在多页签中
     */
    fixedInTabs?: boolean
  }
}
export {}
