<script setup lang='ts'>
import { storeToRefs } from 'pinia'
import { useLayoutMenu } from 'pro-naive-ui'
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLayoutStore } from '@/store/use-layout-store'
import { ProMenu } from '../menu'
import Content from './content.vue'
import Footer from './footer.vue'
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
  showMenuTitleWhenSidebarCollapsed,
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
  return !showMenuTitleWhenSidebarCollapsed.value
    ? sidebarCollapsedWidth.value
    : sidebarCollapsedWidthWhenShowMenuTitle.value
})

watch(() => route.path, (value) => {
  activeKey.value = value
}, { immediate: true })

async function pushTo(path: string) {
  const failure = await router.push(path as string)
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
      <Logo />
    </template>
    <template #nav-left>
      <NavLeft />
    </template>
    <template #nav-center>
      <div class="flex items-center h-full">
        <ProMenu
          v-bind="layout.horizontalMenuProps"
          :indent="18"
          @update:value="pushTo"
        />
      </div>
    </template>
    <template #nav-right>
      <NavRight />
    </template>
    <template #tabbar>
      <Tabbar />
    </template>
    <template #sidebar>
      <n-scrollbar class="flex-[1_0_0]">
        <ProMenu
          v-bind="layout.verticalMenuProps"
          :indent="18"
          :collapsed-width="finalSidebarCollapsedWidth"
          :collapsed-show-title="showMenuTitleWhenSidebarCollapsed"
          @update:value="pushTo"
        />
      </n-scrollbar>
    </template>
    <template #sidebar-extra>
      <!-- <div :style="{ height: navHeight }">
        {{ title }}
      </div> -->
      <n-scrollbar class="flex-[1_0_0]">
        <ProMenu
          v-bind="layout.verticalExtraMenuProps"
          :indent="18"
          :collapsed-width="finalSidebarCollapsedWidth"
          :collapsed-show-title="showMenuTitleWhenSidebarCollapsed"
          @update:value="pushTo"
        />
      </n-scrollbar>
    </template>
    <template #default>
      <Content />
    </template>
    <template #footer>
      <Footer />
    </template>
  </pro-layout>
</template>
