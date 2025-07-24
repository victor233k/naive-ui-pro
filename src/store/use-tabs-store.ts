import { defineStore } from 'pinia'
import { move } from 'pro-naive-ui'
import { ref } from 'vue'

interface Tab {
  id: string
  icon: string
  title: string
  affix: boolean
  active: boolean
  fullPath: string
  iconColor?: string
}

type IndexOrId = number | string

export const useTabsStore = defineStore('tabs', () => {
  const tabs = ref<Tab[]>([])

  function isAffixTab(index: number) {
    return tabs.value[index].affix ?? false
  }

  function isActiveTab(index: number) {
    return tabs.value[index].active ?? false
  }

  function closeOtherTabs(index: number) {
    const id = tabs.value[index].id
    tabs.value = tabs.value.filter((_, i) => {
      return i === index || isAffixTab(i)
    })
    setActiveTab(tabs.value.findIndex(tab => tab.id === id))
  }

  function closeLeftTabs(index: number) {
    tabs.value = tabs.value.filter((_, i) => {
      return i >= index || isAffixTab(i)
    })
    setActiveTab(tabs.value.findIndex(tab => tab.id === id))
  }

  function closeRightTabs(id: string) {
    const index = tryIndexToId(indexOrId)

    tabs.value = tabs.value.filter((_, i) => {
      return i <= index || isAffixTab(i)
    })
    setActiveTab(index)
  }

  function closeTab(id: string) {
    const index = tryIndexToId(indexOrId)

    if (!isAffixTab(index) && tabs.value.length > 1) {
      // const beforeIndex = index - 1
      tabs.value.splice(index, 1)
      if (isActiveTab(index)) {
        // setActiveTab(beforeIndex)
      }
    }
  }

  function moveTab(from: IndexOrId, to: IndexOrId) {
    const fromIndex = tryIndexToId(from)
    const toIndex = tryIndexToId(to)

    move(tabs.value, from, to)
  }

  function closeAllTabs() {
    tabs.value = tabs.value.filter((_, i) => isAffixTab(i))
  }

  function setActiveTab(index: number) {
    if (!isActiveTab(index) && tabs.value[index]) {
      tabs.value[index].active = true
    }
  }

  return {
    tabs,
    moveTab,
    closeTab,
    closeAllTabs,
    setActiveTab,
    closeLeftTabs,
    closeOtherTabs,
    closeRightTabs,
  }
})
