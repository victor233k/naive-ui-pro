import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLeaveConfirmStore = defineStore('leave-confirm', () => {
  const confirmList = ref<string[]>([])

  function init(names: string[]) {
    confirmList.value = [...new Set(names)]
  }
  function add(name: string) {
    if (!confirmList.value.includes(name))
      confirmList.value.push(name)
  }

  function remove(name: string) {
    confirmList.value = confirmList.value.filter(n => n !== name)
  }

  function has(name: string) {
    return confirmList.value.includes(name)
  }

  function getLeaveConfirmList() {
    return confirmList.value
  }

  return {
    init,
    add,
    remove,
    has,
    getLeaveConfirmList,
  }
})
