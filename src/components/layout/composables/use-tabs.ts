import type { Tab } from '@/store/use-tabs-store'
import { useRouter } from 'vue-router'
import { useTabsStore } from '@/store/use-tabs-store'
import { useTabScroll } from './use-tab-scroll'

export function useTabs() {
  const router = useRouter()
  const tabsStore = useTabsStore()
  const { updateNavScroll } = useTabScroll()

  function goToTab(index: number) {
    const currentTab = tabsStore.tabs[index]
    if (currentTab) {
      router.push(currentTab.fullPath)
    }
  }

  function handleActiveTab(index: number) {
    tabsStore.setActiveTab(index)
    goToTab(index)
    updateNavScroll(index)
  }

  function handleAddTab(tab: Tab) {
    const existingIndex = tabsStore.findIndexByFullPath(tab.fullPath)
    if (existingIndex === -1) {
      tabsStore.addTab(tab)
      handleActiveTab(tabsStore.tabs.length - 1)
    }
    else {
      handleActiveTab(existingIndex)
    }
  }

  function handleRemoveTab(index: number) {
    const currentTab = tabsStore.tabs[index]
    if (!currentTab || currentTab.affix) {
      return
    }
    tabsStore.removeTab(index)
    if (currentTab.active && tabsStore.tabs.length) {
      const fallbackIndex = index > 0 ? index - 1 : 0
      handleActiveTab(fallbackIndex)
    }
  }

  function handleCloseLeftTabs(index: number) {
    const currentTab = tabsStore.tabs[index]
    if (!currentTab || index <= 0) {
      return
    }
    tabsStore.closeLeftTabs(index)
    handleFallbackActivation(currentTab.fullPath)
  }

  function handleCloseRightTabs(index: number) {
    const currentTab = tabsStore.tabs[index]
    if (!currentTab || index >= tabsStore.tabs.length - 1) {
      return
    }
    tabsStore.closeRightTabs(index)
    handleFallbackActivation(currentTab.fullPath)
  }

  function handleCloseOtherTabs(index: number) {
    const currentTab = tabsStore.tabs[index]
    if (!currentTab) {
      return
    }
    tabsStore.closeOtherTabs(index)
    handleFallbackActivation(currentTab.fullPath)
  }

  function handleCloseAllTabs() {
    const affixTabs = tabsStore.tabs.filter(tab => tab.affix)
    const fallbackTab = affixTabs.length > 0
      ? affixTabs[affixTabs.length - 1]
      : tabsStore.tabs[0]
    tabsStore.closeAllTabs()
    handleFallbackActivation(fallbackTab.fullPath)
  }

  function handleToggleAffix(index: number) {
    const currentTab = tabsStore.tabs[index]
    if (!currentTab) {
      return
    }
    tabsStore.toggleAffix(index)
    const affixCount = tabsStore.tabs.filter(t => t.affix).length
    if (currentTab.affix) {
      // 固定时，移动到固定标签的末尾
      tabsStore.moveTab(index, affixCount - 1)
    }
    else {
      // 取消固定时，移动到固定标签后面
      tabsStore.moveTab(index, affixCount)
    }
  }

  function handleFallbackActivation(currentFullPath: string) {
    // 如果当前有激活 tab，则不进行操作
    const activeTab = tabsStore.tabs.find(tab => tab.active)
    if (activeTab) {
      return
    }
    // 否则，计算激活 tab 位置，进行激活 tab
    const newIndex = tabsStore.findIndexByFullPath(currentFullPath)
    if (newIndex !== -1) {
      handleActiveTab(newIndex)
    }
  }

  return {
    goToTab,
    handleAddTab,
    handleActiveTab,
    handleRemoveTab,
    handleToggleAffix,
    handleCloseAllTabs,
    handleCloseLeftTabs,
    handleCloseRightTabs,
    handleCloseOtherTabs,
  }
}
