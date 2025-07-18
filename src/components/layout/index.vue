<script setup lang='ts'>
import { storeToRefs } from 'pinia'
import { useLayoutMenu } from 'pro-naive-ui'
import { computed, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLayoutStore } from '@/store/use-layout-store'
import Content from './content.vue'
import Footer from './footer.vue'
import HeaderCenter from './header-center.vue'
import HeaderLeft from './header-left.vue'
import HeaderRight from './header-right.vue'
import Logo from './logo.vue'
import SidebarExtra from './sidebar-extra.vue'
import Sidebar from './sidebar.vue'
import Tabbar from './tabbar.vue'

const {
  mode,
  collapsed,
  mobile,
  showNav,
  showLogo,
  navFixed,
  navHeight,
  showFooter,
  showTabbar,
  showSidebar,
  footerFixed,
  footerHeight,
  sidebarWidth,
  tabbarHeight,
  sidebarMixedWidth,
  sidebarCollapsedWidth,
} = storeToRefs(useLayoutStore())

const route = useRoute()
const router = useRouter()

const {
  layout,
  activeKey,
} = useLayoutMenu({
  mode,
  menus: computed(() => router.buildMenus()),
})

watchEffect(() => {
  activeKey.value = route.path
  // TODO: 这行注释掉，应该由 activeKey 管理
  // expandedKeys.value = route.matched.slice(0, -1).map(item => item.path)
})

watchEffect(async () => {
  if (activeKey.value && route.path !== activeKey.value) {
    const failure = await router.push(activeKey.value as string)
    if (failure) {
      activeKey.value = route.path
    }
  }
})
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
    :show-sidebar="showSidebar"
    :footer-fixed="footerFixed"
    :footer-height="footerHeight"
    :sidebar-width="sidebarWidth"
    :tabbar-height="tabbarHeight"
    :sidebar-mixed-width="sidebarMixedWidth"
    :sidebar-collapsed-width="sidebarCollapsedWidth"
  >
    <template #logo>
      <Logo />
    </template>
    <template #header-left>
      <HeaderLeft />
    </template>
    <template #header-center>
      <HeaderCenter />
    </template>
    <template #header-right>
      <HeaderRight />
    </template>
    <template #tabbar>
      <Tabbar />
    </template>
    <template #sidebar>
      <!-- <Sidebar /> -->
      <n-menu
        v-bind="layout.verticalMenuProps"
        :indent="18"
        :collapsed="collapsed"
        :collapsed-width="sidebarCollapsedWidth"
      />
    </template>
    <template #sidebar-extra>
      <SidebarExtra />
    </template>
    <template #default>
      <Content />
    </template>
    <template #footer>
      <Footer />
    </template>
  </pro-layout>
</template>
