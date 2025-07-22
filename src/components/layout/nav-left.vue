<script setup lang='tsx'>
import type { ProLayoutMode } from 'pro-naive-ui'
import { MenuOutlined, ReloadOutlined } from '@vicons/antd'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useLayoutStore } from '@/store/use-layout-store'

const {
  mode,
  mobile,
  showSidebar,
} = storeToRefs(useLayoutStore())

const showSidebarHiddenButton = computed(() => {
  const layoutMode = mode.value as ProLayoutMode
  if (mobile.value) {
    return false
  }
  return layoutMode !== 'horizontal'
})
</script>

<template>
  <div class="pl-8px flex items-center h-full">
    <pro-button
      v-if="showSidebarHiddenButton"
      quaternary
      size="small"
      @click="showSidebar = !showSidebar"
    >
      <template #icon>
        <n-icon>
          <menu-outlined />
        </n-icon>
      </template>
    </pro-button>
    <pro-button
      quaternary
      circle
      tooltip="刷新页面"
    >
      <template #icon>
        <n-icon>
          <reload-outlined />
        </n-icon>
      </template>
    </pro-button>
  </div>
</template>
