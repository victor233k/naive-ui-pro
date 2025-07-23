<script setup lang='tsx'>
import type { ProLayoutMode } from 'pro-naive-ui'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import logo from '@/assets/logo.svg'
import { useAppStore } from '@/store/use-app-store'
import { useLayoutStore } from '@/store/use-layout-store'

const { title } = storeToRefs(useAppStore())
const {
  mode,
  mobile,
  collapsed,
} = storeToRefs(useLayoutStore())

const enablePaddingLeft = computed(() => {
  const layoutMode = mode.value as ProLayoutMode
  if (mobile.value) {
    return true
  }
  return layoutMode === 'horizontal'
    || layoutMode === 'sidebar'
    || layoutMode === 'mixed-sidebar'
    || (layoutMode === 'vertical' && !collapsed.value)
})

const showAppTitle = computed(() => {
  const layoutMode = mode.value as ProLayoutMode
  if (mobile.value) {
    return false
  }
  return layoutMode === 'sidebar'
    || layoutMode === 'horizontal'
    || layoutMode === 'mixed-sidebar'
    || (layoutMode === 'vertical' && !collapsed.value)
})
</script>

<template>
  <a
    href="javascript: void 0;"
    class="flex items-center gap-12px h-full"
    :class="{
      'pl-12px': enablePaddingLeft,
      'justify-center': !enablePaddingLeft,
    }"
  >
    <img
      :src="logo"
      class="size-32px truncate"
    >
    <h1
      v-show="showAppTitle"
      class="truncate text-18px"
    >{{ title }}</h1>
  </a>
</template>
