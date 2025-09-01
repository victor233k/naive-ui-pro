<script setup lang="tsx">
import type { DropdownMixedOption } from 'naive-ui/es/dropdown/src/interface'
import { Icon } from '@iconify/vue'
import { NIcon, useDialog } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { $t } from '@/locales/locales'
import { useUserStore } from '@/store/use-user-store'

const dialog = useDialog()
const userStore = useUserStore()

const {
  user,
} = storeToRefs(userStore)

const options = computed<DropdownMixedOption[]>(() => [
  {
    label: $t('common.layout.userAvatar.documentation'),
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
    label: $t('common.layout.userAvatar.documentationForProNaiveUI'),
    key: 'docProNaiveUI',
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
    label: $t('common.layout.userAvatar.logout'),
    key: 'logout',
    icon: () => {
      return (
        <NIcon>
          <Icon icon="material-symbols:logout" />
        </NIcon>
      )
    },
  },
])

function handleSelect(key: string) {
  if (key === 'doc') {
    window.open('https://docs-naive-ui-pro.pro-components.cn', '_blank')
    return
  }
  if (key === 'docProNaiveUI') {
    window.open('https://naive-ui.pro-components.cn', '_blank')
    return
  }
  if (key === 'github') {
    window.open('https://github.com/Zheng-Changfu/naive-ui-pro', '_blank')
    return
  }
  if (key === 'logout') {
    dialog.info({
      title: $t('common.layout.userAvatar.logoutConfirmTitle'),
      content: $t('common.layout.userAvatar.logoutConfirmContent'),
      negativeText: $t('common.often.cancel'),
      positiveText: $t('common.often.confirm'),
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
