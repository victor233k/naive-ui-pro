<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useLayoutStore } from '@/store/use-layout-store'
import CollapseSidebarButton from './collapse-sidebar-button.vue'
import Logo from './logo.vue'

interface MobileSidebarDrawerProps {
  /**
   * 移动端菜单抽屉折叠后的宽度
   */
  collapsedWidth: number
}

defineProps<MobileSidebarDrawerProps>()

const {
  collapsed,
  sidebarWidth,
  showMobileSidebarDrawer,
} = storeToRefs(useLayoutStore())
</script>

<template>
  <n-drawer
    v-model:show="showMobileSidebarDrawer"
    :auto-focus="false"
    :width="collapsed ? collapsedWidth : sidebarWidth"
    placement="left"
    class="mobile-sidebar-drawer transition-[width] duration-300 ease-[var(--n-bezier)]"
  >
    <n-drawer-content :native-scrollbar="false">
      <template #header>
        <logo using-mobile-sidebar-drawer />
      </template>
      <div class="flex flex-col h-full">
        <slot />
        <div class="p-8px">
          <collapse-sidebar-button />
        </div>
      </div>
    </n-drawer-content>
  </n-drawer>
</template>

<style scoped>
.mobile-sidebar-drawer {
  .n-drawer-content {
    :deep(.n-scrollbar-content) {
      height: 100%;
    }
    :deep(.n-drawer-header) {
      padding-left: 0;
      padding-right: 0;
    }
    :deep(.n-drawer-body-content-wrapper) {
      padding: 0;
    }
  }
}
</style>
