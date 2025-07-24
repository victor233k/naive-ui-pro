import { preferenceConfig } from '@root/preference'
import { defineStore } from 'pinia'
import { reactive, ref, toRefs } from 'vue'

export const useAppStore = defineStore('app', () => {
  const showPreferenceDrawer = ref(false)
  const app = reactive({ ...preferenceConfig.app })

  function $reset() {
    Object.assign(app, { ...preferenceConfig.app })
  }

  return {
    $reset,
    ...toRefs(app),
    showPreferenceDrawer,
  }
})
