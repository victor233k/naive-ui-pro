<script setup lang='ts'>
import type { ProLayoutMode } from 'pro-naive-ui'
import { storeToRefs } from 'pinia'
import { useLayoutMenu } from 'pro-naive-ui'
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLayoutStore } from '@/store/use-layout-store'
import { ProMenu } from '../menu'
import CollapseSidebarButton from './collapse-sidebar-button.vue'
import Content from './content.vue'
import Logo from './logo.vue'
import NavLeft from './nav-left.vue'
import NavRight from './nav-right.vue'
import Tabbar from './tabbar.vue'

const route = useRoute()
const router = useRouter()

const {
  mode,
  mobile,
  showNav,
  showLogo,
  navFixed,
  navHeight,
  collapsed,
  showFooter,
  showTabbar,
  showSidebar,
  footerFixed,
  footerHeight,
  sidebarWidth,
  tabbarHeight,
  sidebarCollapsedWidth,
  sidebarCollapsedShowMenuTitle,
  sidebarCollapsedWidthWhenShowMenuTitle,
} = storeToRefs(useLayoutStore())

const {
  layout,
  activeKey,
} = useLayoutMenu({
  mode,
  menus: computed(() => router.buildMenus()),
})

const finalShowSidebar = computed(() => {
  const verticalMenuOptions = layout.value.verticalMenuProps.options ?? []
  return showSidebar.value && verticalMenuOptions.length > 0
})

const showSidebarExtra = computed(() => {
  const verticalExtraMenuOptions = layout.value.verticalExtraMenuProps.options ?? []
  return verticalExtraMenuOptions.length > 0
})

const finalSidebarCollapsedWidth = computed(() => {
  return !sidebarCollapsedShowMenuTitle.value
    ? sidebarCollapsedWidth.value
    : sidebarCollapsedWidthWhenShowMenuTitle.value
})

const showSidebarCollapseButton = computed(() => {
  const layoutMode = mode.value as ProLayoutMode
  return layoutMode === 'vertical'
    || layoutMode === 'sidebar'
    || layoutMode === 'mixed-sidebar'
})

const showSidebarExtraCollapseButton = computed(() => {
  const layoutMode = mode.value as ProLayoutMode
  return layoutMode === 'two-column'
    || layoutMode === 'mixed-two-column'
})

watch(() => route.path, (value) => {
  activeKey.value = value
}, { immediate: true })

async function pushTo(path: string) {
  const failure = await router.push(path)
  if (failure) {
    // 跳转失败回退
    activeKey.value = route.path
  }
}
</script>

<template>
  <pro-layout
    v-model:collapsed="collapsed"
    :mode="mode"
    :is-mobile="mobile"
    :show-nav="showNav"
    :show-logo="showLogo"
    :nav-fixed="navFixed"
    :nav-height="navHeight"
    :show-footer="showFooter"
    :show-tabbar="showTabbar"
    :footer-fixed="footerFixed"
    :footer-height="footerHeight"
    :sidebar-width="sidebarWidth"
    :tabbar-height="tabbarHeight"
    :show-sidebar="finalShowSidebar"
    :show-sidebar-extra="showSidebarExtra"
    :sidebar-collapsed-width="finalSidebarCollapsedWidth"
  >
    <template #logo>
      <logo />
    </template>
    <template #nav-left>
      <nav-left />
    </template>
    <template #nav-center>
      <div v-show="!mobile" class="flex items-center h-full">
        <pro-menu
          v-bind="layout.horizontalMenuProps"
          :indent="18"
          @update:value="pushTo"
        />
      </div>
    </template>
    <template #nav-right>
      <nav-right />
    </template>
    <template #tabbar>
      <tabbar />
    </template>
    <template #sidebar>
      <div class="flex flex-col h-full">
        <n-scrollbar class="flex-[1_0_0]">
          <pro-menu
            v-bind="layout.verticalMenuProps"
            :indent="18"
            :collapsed-width="finalSidebarCollapsedWidth"
            :collapsed-show-title="sidebarCollapsedShowMenuTitle"
            @update:value="pushTo"
          />
        </n-scrollbar>
        <div v-if="showSidebarCollapseButton" class="flex p-8px">
          <collapse-sidebar-button />
        </div>
      </div>
    </template>
    <template #sidebar-extra>
      <div class="flex flex-col h-full">
        <n-scrollbar class="flex-[1_0_0]">
          <pro-menu
            v-bind="layout.verticalExtraMenuProps"
            :indent="18"
            :collapsed-width="finalSidebarCollapsedWidth"
            :collapsed-show-title="sidebarCollapsedShowMenuTitle"
            @update:value="pushTo"
          />
        </n-scrollbar>
        <div v-if="showSidebarExtraCollapseButton" class="flex p-8px">
          <collapse-sidebar-button />
        </div>
      </div>
    </template>
    <template #default>
      <content />
    </template>
    <template #footer>
      <footer />
    </template>
  </pro-layout>
</template>
