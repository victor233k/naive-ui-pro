<script setup lang="tsx">
import type { DropdownMixedOption } from 'naive-ui/es/dropdown/src/interface'
import { Icon } from '@iconify/vue'
import { NIcon } from 'naive-ui'
import { Lang } from '@/locales/locales'
import { useAppStore } from '@/store/use-app-store'

const appStore = useAppStore()

const options: DropdownMixedOption[] = [
  {
    label: '简体中文',
    key: Lang.ZH_CN,
    icon: () => {
      return (
        <NIcon>
          <Icon icon="noto-v1:flag-for-flag-china" />
        </NIcon>
      )
    },
  },
  {
    label: 'English',
    key: Lang.EN_US,
    icon: () => {
      return (
        <NIcon>
          <Icon icon="circle-flags:lang-en-us" />
        </NIcon>
      )
    },
  },
]
</script>

<template>
  <n-dropdown
    :value="appStore.lang"
    trigger="hover"
    :options="options"
    @select="appStore.lang = $event"
  >
    <pro-button
      quaternary
      size="small"
    >
      <template #icon>
        <n-icon>
          <icon icon="meteor-icons:language" />
        </n-icon>
      </template>
    </pro-button>
  </n-dropdown>
</template>
