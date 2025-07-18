import { preferenceConfig } from '@root/preference'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const showPreferenceDrawer = ref(false)
  const title = ref(preferenceConfig.app.title)

  return {
    title,
    showPreferenceDrawer,
  }
})
