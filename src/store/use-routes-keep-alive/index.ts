import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useRoutesKeepAliveStore = defineStore('routes-keep-alive', () => {
  const keepAliveList = ref<string[]>([])

  function init(keepAlive: string[]) {
    keepAliveList.value = keepAlive
  }

  function add(name: string) {
    if (!keepAliveList.value.includes(name))
      keepAliveList.value.push(name)
  }

  function remove(name: string) {
    keepAliveList.value = keepAliveList.value.filter(n => n !== name)
  }

  function getKeepAliveList() {
    return keepAliveList.value
  }

  return {
    init,
    add,
    remove,
    getKeepAliveList,
  }
})
