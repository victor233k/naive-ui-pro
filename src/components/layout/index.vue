<script setup lang='ts'>
import { storeToRefs } from 'pinia'
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/store/use-app-store'
import { useLayoutStore } from '@/store/use-layout-store'
import Content from './content.vue'
import Footer from './footer.vue'
import HeaderLeft from './header-left.vue'
import HeaderRight from './header-right.vue'
import { ProLayout as IProLayout } from './layout'
import Logo from './logo.vue'
import Tabbar from './tabbar.vue'
import { useLayoutMenu } from './use-layout-menu'

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
  showSidebar: _,
  footerFixed,
  footerHeight,
  sidebarWidth,
  tabbarHeight,
  sidebarCollapsedWidth,
} = storeToRefs(useLayoutStore())

const {
  title,
} = storeToRefs(useAppStore())

const route = useRoute()
const router = useRouter()

const {
  layout,
  activeKey,
} = useLayoutMenu({
  mode,
  collapsed,
  autoActiveDetachedSubMenu: false,
  menus: computed(() => router.buildMenus()),
})

const showSidebar = computed(() => {
  return _.value && (layout.value.verticalMenuProps.options ?? []).length > 0
})

watch(
  () => route.path,
  (value) => {
    activeKey.value = value
  },
)

watch(
  () => activeKey.value,
  async (path) => {
    const failure = await router.push(path as string)
    if (failure) {
      activeKey.value = route.path
    }
  },
)
</script>

<template>
  <IProLayout
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
    :sidebar-collapsed-width="sidebarCollapsedWidth"
  >
    <template #logo>
      <Logo />
    </template>
    <template #nav-left>
      <HeaderLeft />
    </template>
    <template #nav-center>
      <div class="flex items-center h-full">
        <n-menu
          v-bind="layout.horizontalMenuProps"
          :indent="18"
        />
      </div>
      <!-- <HeaderCenter /> -->
    </template>
    <template #nav-right>
      <HeaderRight />
    </template>
    <template #tabbar>
      <Tabbar />
    </template>
    <template #sidebar>
      <n-menu
        v-bind="layout.verticalMenuProps"
        :indent="18"
        :collapsed-width="sidebarCollapsedWidth"
      />
    </template>
    <template #sidebar-extra>
      <div :style="{ height: navHeight }">
        {{ title }}
      </div>
      <n-menu
        v-bind="layout.verticalExtraMenuProps"
        :indent="18"
        :collapsed-width="sidebarCollapsedWidth"
      />
    </template>
    <template #default>
      <Content />
    </template>
    <template #footer>
      <Footer />
    </template>
  </IProLayout>
</template>
