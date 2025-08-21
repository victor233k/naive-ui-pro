import { useResizeObserver } from '@vueuse/core'
import { nextTick, ref } from 'vue'
import { useRouter } from 'vue-router'

const scrollbarRef = ref<HTMLElement | null>(null)
const tabbarRef = ref<HTMLElement | null>(null)
const tabListRef = ref<HTMLElement | null>(null)

export function useTabScroll() {
  const router = useRouter()
  const { activeIndex } = router.visitedRoutesPlugin

  function updateNavScroll(index: number) {
    nextTick(() => {
      if (!tabListRef.value || !scrollbarRef.value) {
        return
      }
      const tabElement = tabListRef.value.children[index]
      if (tabElement && scrollbarRef.value) {
        scrollbarRef.value.scrollTo({
          left: (tabElement as HTMLElement).offsetLeft,
          behavior: 'smooth',
        })
      }
    })
  }

  function scrollToActiveTab() {
    if (activeIndex.value !== -1) {
      updateNavScroll(activeIndex.value)
    }
  }

  function handleWheel(e: WheelEvent) {
    scrollbarRef.value?.scrollBy({
      left: e.deltaY,
      behavior: 'smooth',
    })
  }

  useResizeObserver(tabbarRef, scrollToActiveTab)

  return {
    tabbarRef,
    tabListRef,
    handleWheel,
    scrollbarRef,
    updateNavScroll,
    scrollToActiveTab,
  }
}
