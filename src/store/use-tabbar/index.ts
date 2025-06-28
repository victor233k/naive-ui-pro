import type { RouteLocationNormalized } from 'vue-router'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTabbarStore = defineStore('tabbar', () => {
  // 当前打开的标签页列表
  const tabs = ref<RouteLocationNormalized[]>([])

  // 初始化标签页
  function initTabs(routes: RouteLocationNormalized[]) {
    tabs.value = routes
  }

  // 获取当前打开的标签页列表
  function getTabs(): RouteLocationNormalized[] {
    return tabs.value
  }

  // 新增tab
  function addTab(route: RouteLocationNormalized) {
    if (tabs.value.some(tab => tab.fullPath === route.fullPath)) {
      return
    }
    tabs.value.push(route)
  }

  // 移除tab
  function removeTab(route: RouteLocationNormalized) {
    tabs.value = tabs.value.filter(tab => tab.fullPath !== route.fullPath)
  }

  // 关闭左侧
  function closeLeftTabs(route: RouteLocationNormalized) {
    const index = tabs.value.findIndex(tab => tab.fullPath === route.fullPath)
    if (index > 0) {
      tabs.value = tabs.value.slice(index)
    }
  }

  // 关闭右侧
  function closeRightTabs(route: RouteLocationNormalized) {
    const index = tabs.value.findIndex(tab => tab.fullPath === route.fullPath)
    if (index >= 0 && index < tabs.value.length - 1) {
      tabs.value = tabs.value.slice(0, index + 1)
    }
  }
  // 关闭其他
  function closeOtherTabs(route: RouteLocationNormalized) {
    const index = tabs.value.findIndex(tab => tab.fullPath === route.fullPath)
    if (index >= 0) {
      tabs.value = [tabs.value[index]]
    }
  }

  return {
    addTab,
    getTabs,
    initTabs,
    removeTab,
    closeLeftTabs,
    closeRightTabs,
    closeOtherTabs,
  }
})
