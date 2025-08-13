<script setup lang="ts">
import { NCard } from 'naive-ui'
import { computed } from 'vue'
import { $t } from '@/locales/locales'
import { useAppStore } from '@/store/use-app-store'
import { useUserStore } from '@/store/use-user-store'

const appStore = useAppStore()
const userStore = useUserStore()

const accessModes = computed(() => {
  return [
    { label: $t('pages.demos.access.toggle.frontendControl'), value: 'frontend' },
    { label: $t('pages.demos.access.toggle.backendControl'), value: 'backend' },
  ]
})

const accounts = computed(() => {
  return [
    { username: 'super', password: '123456', role: 'super', roleName: $t('pages.demos.access.toggle.superAdmin') },
    { username: 'admin', password: '123456', role: 'admin', roleName: $t('pages.demos.access.toggle.admin') },
    { username: 'user', password: '123456', role: 'user', roleName: $t('pages.demos.access.toggle.user') },
  ]
})

async function handleAccount(account: { username: string, password: string }) {
  await userStore.logoutWithQueryRedirect()
  await userStore.login(account)
}

async function handleAccessMode(accessMode: string) {
  appStore.accessMode = accessMode
  const account = accounts.value.find(account => account.username === userStore.user.name.toLowerCase())!
  await userStore.logoutWithQueryRedirect()
  await userStore.login(account)
}
</script>

<template>
  <div class="flex flex-col gap-16px">
    <n-card :title="$t('pages.demos.access.toggle.toggleMode')">
      <div class="mb-8px font-bold">
        {{ $t('pages.demos.access.toggle.afterToggleCheck') }}
      </div>
      <div class="flex gap-8px">
        <n-button
          v-for="accessMode in accessModes"
          :key="accessMode.value"
          :disabled="appStore.accessMode === accessMode.value"
          @click="handleAccessMode(accessMode.value)"
        >
          {{ accessMode.label }}
        </n-button>
      </div>
    </n-card>
    <n-card :title="$t('pages.demos.access.toggle.toggleAccount')">
      <div class="mb-8px font-bold">
        {{ $t('pages.demos.access.toggle.afterAccountCheck') }}
      </div>
      <div class="flex gap-8px">
        <n-button
          v-for="account in accounts"
          :key="account.username"
          :disabled="userStore.user.roles.includes(account.role)"
          @click="handleAccount(account)"
        >
          {{ account.roleName }}
        </n-button>
      </div>
    </n-card>
  </div>
</template>
