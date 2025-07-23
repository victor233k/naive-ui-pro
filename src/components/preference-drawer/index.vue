<script setup lang='tsx'>
import { useAppStore } from '@/store/use-app-store'
import { useLayoutStore } from '@/store/use-layout-store'
import { useThemeStore } from '@/store/use-theme-store'
import AppPreference from './app-preference.vue'
import LayoutPreference from './layout-preference.vue'
import ThemePreference from './theme-preference.vue'

const itemHeight = 32
const appStore = useAppStore()
const themeStore = useThemeStore()
const layoutStore = useLayoutStore()

function resetConfig() {
  themeStore.$reset()
  layoutStore.$reset()
}
</script>

<template>
  <n-drawer
    v-model:show="appStore.showPreferenceDrawer"
    :auto-focus="false"
    :width="320"
    :style="{
      '--preference-item-height': itemHeight,
    }"
  >
    <n-drawer-content
      title="偏好设置"
      closable
      :native-scrollbar="false"
    >
      <n-tabs type="segment" animated>
        <n-tab-pane name="theme" tab="主题">
          <theme-preference />
        </n-tab-pane>
        <n-tab-pane name="layout" tab="布局">
          <layout-preference />
        </n-tab-pane>
        <n-tab-pane name="other" tab="其他">
          <app-preference />
        </n-tab-pane>
      </n-tabs>
      <template #footer>
        <n-flex justify="space-between" class="w-full">
          <n-button @click="resetConfig">
            重置配置
          </n-button>
          <n-button type="primary">
            复制配置
          </n-button>
        </n-flex>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>

<style lang="scss">
.preference-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: calc(var(--preference-item-height) * 1px);

  &>span {
    user-select: none;
  }
}
</style>
