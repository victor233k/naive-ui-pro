import { preferenceConfig } from '@root/preference'
import { defineStore } from 'pinia'
import { reactive, ref, toRefs } from 'vue'

export const useAppStore = defineStore('app', () => {
  const showPreferenceDrawer = ref(false)
  const app = reactive({ ...preferenceConfig.app })

  return {
    ...toRefs(app),
    showPreferenceDrawer,
  }
}, {
  preference: {
    pick: [Object.keys(preferenceConfig.app), 'app'],
  },
})
