import { defineStore } from 'pinia'
import { move } from 'pro-naive-ui'
import { ref } from 'vue'

export interface Tab {
  icon: string
  title: string
  affix: boolean
  active: boolean
  fullPath: string
}

export const CACHE_KEY = 'NAIVE_UI_PRO__TABS'

export const useTabsStore = defineStore('tabs', () => {
  const tabs = ref<Tab[]>([])

  function findIndexByFullPath(fullPath: string) {
    return tabs.value.findIndex(tab => tab.fullPath === fullPath)
  }

  function setActiveTab(index: number) {
    tabs.value.forEach((tab, i) => {
      tab.active = i === index
    })
  }

  function initTabs() {
    const cachedTabs = localStorage.getItem(CACHE_KEY)
    if (cachedTabs) {
      tabs.value = JSON.parse(cachedTabs)
    }
  }

  function cacheTabs() {
    localStorage.setItem(CACHE_KEY, JSON.stringify(tabs.value))
  }

  function addTab(tab: Tab) {
    tabs.value.push({ ...tab })
  }

  function removeTab(index: number) {
    tabs.value.splice(index, 1)
  }

  function closeLeftTabs(index: number) {
    tabs.value = tabs.value.filter((tab, i) => i >= index || tab.affix)
  }

  function closeRightTabs(index: number) {
    tabs.value = tabs.value.filter((tab, i) => i <= index || tab.affix)
  }

  function closeOtherTabs(index: number) {
    tabs.value = tabs.value.filter((tab, i) => i === index || tab.affix)
  }

  function closeAllTabs() {
    const affixTabs = tabs.value.filter(tab => tab.affix)
    tabs.value = affixTabs.length > 0 ? affixTabs : tabs.value.slice(0, 1)
  }

  function moveTab(from: number, to: number) {
    move(tabs.value, from, to)
  }

  function toggleAffix(index: number) {
    tabs.value[index].affix = !tabs.value[index].affix
  }

  return {
    tabs,
    initTabs,
    cacheTabs,
    findIndexByFullPath,
    setActiveTab,
    addTab,
    removeTab,
    closeLeftTabs,
    closeRightTabs,
    closeOtherTabs,
    closeAllTabs,
    moveTab,
    toggleAffix,
  }
})
