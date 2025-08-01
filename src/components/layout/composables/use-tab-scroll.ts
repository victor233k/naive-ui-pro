import { useResizeObserver } from '@vueuse/core'
import { nextTick, ref } from 'vue'
import { useTabsStore } from '@/store/use-tabs-store'

const scrollbarRef = ref<HTMLElement | null>(null)
const tabbarRef = ref<HTMLElement | null>(null)
const tabListRef = ref<HTMLElement | null>(null)

export function useTabScroll() {
  const tabsStore = useTabsStore()

  function updateNavScroll(index: number) {
    nextTick(() => {
      if (!tabListRef.value) {
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
    const activeIndex = tabsStore.tabs.findIndex(tab => tab.active)
    if (activeIndex !== -1) {
      updateNavScroll(activeIndex)
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
