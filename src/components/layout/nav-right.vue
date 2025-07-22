<script setup lang='tsx'>
import { SettingOutlined } from '@vicons/antd'
import { FullScreenMaximize24Regular, FullScreenMinimize24Regular } from '@vicons/fluent'
import { Moon, SunnyOutline } from '@vicons/ionicons5'
import { useFullscreen } from '@vueuse/core'
import { useAppStore } from '@/store/use-app-store'
import { useThemeStore } from '@/store/use-theme-store'

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
          <setting-outlined />
        </n-icon>
      </template>
    </pro-button>
    <pro-button
      quaternary
      size="small"
      :tooltip="isFullscreen ? '退出全屏' : '全屏'"
      @click="toggle"
    >
      <template #icon>
        <n-icon>
          <full-screen-maximize24-regular v-if="!isFullscreen" />
          <full-screen-minimize24-regular v-else />
        </n-icon>
      </template>
    </pro-button>
    <n-switch :value="themeStore.isDark" class="mx-8px">
      <template #checked-icon>
        <n-icon :component="Moon" />
      </template>
      <template #unchecked-icon>
        <n-icon :component="SunnyOutline" />
      </template>
    </n-switch>
  </div>
</template>
