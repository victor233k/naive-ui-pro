<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useLayoutMenu } from 'pro-naive-ui'
import { computed  } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLayoutStore } from '@/store/use-layout-store'
import Logo from '../layout/logo.vue'
import { ProMenu } from '../menu'

const router = useRouter()
const route = useRoute()
const { showSidebarMobile } = storeToRefs(useLayoutStore())


const { layout, activeKey } = useLayoutMenu({
  mode: 'vertical',
  menus: computed(() => router.buildMenus()),
})

async function pushTo(path: string) {
  const failure = await router.push(path)
  if (failure) {
    // 跳转失败回退
    activeKey.value = route.path
  }
}
</script>

<template>
  <div>
    <n-drawer
      v-model:show="showSidebarMobile"
      :auto-focus="false"
      :width="224"
      placement="left"
      :style="{
        '--n-body-padding': 0,
      }"
    >
      <n-drawer-content :native-scrollbar="false">
        <template #header>
          <logo is-mobile-menu-use/>
        </template>
        <pro-menu
          v-bind="layout.verticalMenuProps"
          :indent="18"
          @update:value="pushTo"
        />
      </n-drawer-content>
    </n-drawer>
  </div>
</template>
