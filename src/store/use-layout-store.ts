import { preferenceConfig } from '@root/preference'
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import { defineStore } from 'pinia'
import { computed, reactive, ref, toRefs } from 'vue'

function useMobile() {
  const breakpoints = useBreakpoints(breakpointsTailwind)
  return computed(() => {
    return breakpoints.between('sm', 'md').value || breakpoints.smallerOrEqual('sm').value
  })
}

export const useLayoutStore = defineStore('layout', () => {
  const mobile = useMobile()
  const showSidebarMobile = ref(false)
  const layout = reactive({ ...preferenceConfig.layout })

  function $reset() {
    Object.assign(layout, { ...preferenceConfig.layout })
  }

  return {
    $reset,
    mobile,
    showSidebarMobile,
    ...toRefs(layout),
  }
})
