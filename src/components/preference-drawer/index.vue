<script setup lang='tsx'>
import { ref } from 'vue'
import { useLayoutStore } from '@/store/use-layout'
import { useThemeStore } from '@/store/use-theme'
import LayoutPreference from './layout-preference.vue'
import ThemePreference from './theme-preference.vue'

const show = ref(true)
const preferenceItemHeight = 32
const themeStore = useThemeStore()
const layoutStore = useLayoutStore()

function resetConfig() {
  themeStore.$reset()
  layoutStore.$reset()
}
</script>

<template>
  <n-drawer
    v-model:show="show"
    :auto-focus="false"
    :width="320"
    :style="{
      '--preference-item-height': preferenceItemHeight,
    }"
  >
    <n-drawer-content
      title="偏好设置"
      closable
      :native-scrollbar="false"
    >
      <n-tabs type="segment" animated>
        <n-tab-pane name="theme" tab="主题">
          <ThemePreference />
        </n-tab-pane>
        <n-tab-pane name="layout" tab="布局">
          <LayoutPreference />
        </n-tab-pane>
        <n-tab-pane name="other" tab="其他">
          <ThemePreference />
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
