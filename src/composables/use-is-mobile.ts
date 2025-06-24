import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import { computed } from 'vue'

export function useIsMobile() {
  const breakpoints = useBreakpoints(breakpointsTailwind)
  return computed(() => {
    return breakpoints.between('sm', 'md').value || breakpoints.smallerOrEqual('sm').value
  })
}
