<script setup lang='ts'>
import { storeToRefs } from 'pinia'
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
      <Sidebar />
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
