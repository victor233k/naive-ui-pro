import type { LangType } from '@/locales/locales'
import { preferenceConfig } from '@root/preference'
import { defineStore } from 'pinia'
import { computed, reactive, ref, toRefs, watch } from 'vue'
import { i18n, Lang } from '@/locales/locales'

export const useAppStore = defineStore('app', () => {
  const showPreferenceDrawer = ref(false)
  const app = reactive({ ...preferenceConfig.app })

  const isZhCN = computed(() => {
    return app.lang === Lang.ZH_CN
  })

  watch(() => app.lang, () => {
    i18n.global.locale.value = app.lang as LangType
  }, { immediate: true })

  return {
    isZhCN,
    ...toRefs(app),
    showPreferenceDrawer,
  }
}, {
  preference: {
    pick: [Object.keys(preferenceConfig.app), 'app'],
  },
})
