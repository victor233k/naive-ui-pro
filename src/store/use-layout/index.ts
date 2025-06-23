import { preferenceConfig } from '@root/preference'
import { defineStore } from 'pinia'
import { reactive, toRefs } from 'vue'
import { useIsMobile } from '@/composables/use-is-mobile'

export const useLayoutStore = defineStore('layout', () => {
  const isMobile = useIsMobile()
  const layout = reactive({ ...preferenceConfig.layout })

  function $reset() {
    Object.assign(layout, preferenceConfig.layout)
  }

  return {
    $reset,
    isMobile,
    ...toRefs(layout),
  }
})
