<script setup lang="tsx">
import type { DropdownMixedOption } from 'naive-ui/es/dropdown/src/interface'
import { Icon } from '@iconify/vue'
import { NIcon, useDialog } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/store/use-user-store'

const dialog = useDialog()
const userStore = useUserStore()

const {
  user,
} = storeToRefs(userStore)

const options: DropdownMixedOption[] = [
  {
    label: '文档',
    key: 'doc',
    icon: () => {
      return (
        <NIcon>
          <Icon icon="formkit:filedoc" />
        </NIcon>
      )
    },
  },
  {
    label: 'Github',
    key: 'github',
    icon: () => {
      return (
        <NIcon>
          <Icon icon="akar-icons:github-fill" />
        </NIcon>
      )
    },
  },
  {
    type: 'divider',
  },
  {
    label: '退出登录',
    key: 'logout',
    icon: () => {
      return (
        <NIcon>
          <Icon icon="material-symbols:logout" />
        </NIcon>
      )
    },
  },
]

function handleSelect(key: string) {
  if (key === 'doc') {
    window.open('https://naive-ui.pro-components.cn', '_blank')
  }
  if (key === 'github') {
    window.open('https://github.com/Zheng-Changfu/naive-ui-pro', '_blank')
  }
  if (key === 'logout') {
    dialog.info({
      title: '提示',
      content: '确认退出登录吗？',
      negativeText: '取 消',
      positiveText: '确 认',
      onPositiveClick: () => {
        userStore.logoutWithQueryRedirect()
      },
    })
  }
}
</script>

<template>
  <n-dropdown
    trigger="hover"
    :options="options"
    @select="handleSelect"
  >
    <pro-button quaternary>
      <template #icon>
        <n-icon>
          <icon icon="majesticons:user-line" />
        </n-icon>
      </template>
      {{ user.name }}
    </pro-button>
  </n-dropdown>
</template>
