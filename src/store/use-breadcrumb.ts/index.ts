import type { BreadcrumbItem } from '@/router/plugins/routeToBreadcrumbPlugin'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useBreadcrumbStore = defineStore('breadcrumb', () => {
  const breadcrumbs = ref<BreadcrumbItem[]>([])

  function updateBreadcrumbs(items: BreadcrumbItem[]) {
    breadcrumbs.value = items
  }

  function getBreadcrumbs() {
    return breadcrumbs.value
  }

  return {
    getBreadcrumbs,
    updateBreadcrumbs,
  }
})
