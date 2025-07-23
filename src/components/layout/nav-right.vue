<script setup lang='tsx'>
import { Icon } from '@iconify/vue'
import { useFullscreen } from '@vueuse/core'
import { useAppStore } from '@/store/use-app-store'
import { useThemeStore } from '@/store/use-theme-store'
import UserAvatar from './user-avatar.vue'

const appStore = useAppStore()
const themeStore = useThemeStore()

const {
  toggle,
  isFullscreen,
} = useFullscreen()
</script>

<template>
  <div class="pr-8px flex items-center h-full">
    <pro-button quaternary size="small" @click="appStore.showPreferenceDrawer = true">
      <template #icon>
        <n-icon>
          <icon icon="uil:setting" />
        </n-icon>
      </template>
    </pro-button>
    <pro-button
      quaternary
      size="small"
      @click="themeStore.toggleThemeModeWithAnimation"
    >
      <template #icon>
        <n-icon>
          <icon :icon="themeStore.isDark ? 'ri:sun-fill' : 'fa6-solid:moon'" />
        </n-icon>
      </template>
    </pro-button>
    <pro-button
      quaternary
      size="small"
      @click="toggle"
    >
      <template #icon>
        <n-icon>
          <icon :icon="isFullscreen ? 'mingcute:fullscreen-exit-line' : 'mingcute:fullscreen-line'" />
        </n-icon>
      </template>
    </pro-button>
    <user-avatar />
  </div>
</template>
