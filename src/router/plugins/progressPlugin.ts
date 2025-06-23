import type { Plugin } from '../composables/create-router'
import { startProgress, stopProgress } from '@/utils'

export function progressPlugin(): Plugin {
  return {
    name: 'progress',
    beforeEach() {
      startProgress()
      return true
    },
    afterEach() {
      stopProgress()
    },
    onError(err) {
      stopProgress()
      console.warn('路由错误', err)
    },
  }
}
