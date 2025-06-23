import type { Plugin } from '../composables/create-router'

export function authPlugin(): Plugin {
  return {
    name: 'auth',
    beforeEach() {
      console.warn('authPlugin')
    },
  }
}
