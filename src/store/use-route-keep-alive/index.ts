import { defineStore } from 'pinia'

export const useRouteKeepAliveStore = defineStore('route-keep-alive', {
  state: () => ({
    keepAliveList: [] as string[],
  }),

  actions: {
    add(name: string) {
      if (name && !this.keepAliveList.includes(name))
        this.keepAliveList.push(name)
    },

    remove(name: string) {
      const idx = this.keepAliveList.indexOf(name)
      if (idx !== -1)
        this.keepAliveList.splice(idx, 1)
    },

    reset() {
      this.keepAliveList = []
    },
  },
})
