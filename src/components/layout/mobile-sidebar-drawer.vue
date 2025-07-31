<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useLayoutStore } from '@/store/use-layout-store'
import CollapseSidebarButton from './collapse-sidebar-button.vue'
import Logo from './logo.vue'

interface MobileSidebarDrawerProps {
  /**
   * 移动端菜单抽屉折叠后的宽度
   */
  drawerCollapsedWidth: number
}
defineProps<MobileSidebarDrawerProps>()

const { showMobileMenuDrawer, sidebarWidth, collapsed } = storeToRefs(useLayoutStore())
</script>

<template>
  <n-drawer
    v-model:show="showMobileMenuDrawer"
    :auto-focus="false"
    :width="collapsed ? drawerCollapsedWidth : sidebarWidth"
    placement="left"
    class="mobile-sidebar-drawer"
  >
    <n-drawer-content :native-scrollbar="false">
      <template #header>
        <logo is-mobile-sidebar-drawer-be-used />
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

<style>
.mobile-sidebar-drawer {
  transition: width .3s var(--n-bezier);
  .n-drawer-content {
    .n-scrollbar-content {
      height: 100%;
    }
    .n-drawer-header {
      padding-left: 0;
      padding-right: 0;
    }
    .n-drawer-body-content-wrapper {
      padding: 0;
    }
  }
}
</style>
