import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useRoutesKeepAliveStore = defineStore('routes-keep-alive', () => {
  const keepAliveList = ref<(string | RegExp)[]>([])

  function add(name: string | RegExp) {
    if (!keepAliveList.value.includes(name))
      keepAliveList.value.push(name)
  }

  function remove(name: string | RegExp) {
    keepAliveList.value = keepAliveList.value.filter(n => n !== name)
  }

  function getKeepAliveList() {
    return keepAliveList.value
  }

  return {
    add,
    remove,
    getKeepAliveList,
  }
})
