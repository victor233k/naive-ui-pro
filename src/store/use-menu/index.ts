import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface MenuItem {
  title: string
  path: string
  icon?: string
  name?: string
  children?: MenuItem[]
}

export const useMenuStore = defineStore('menu', () => {
  const menus = ref<MenuItem[]>([])

  function initMenus(list: MenuItem[]) {
    menus.value = list
  }

  return {
    menus,
    initMenus,
  }
})
