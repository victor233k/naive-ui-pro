<script setup lang="ts">
import { NCard, useThemeVars } from 'naive-ui'
import { computed, ref } from 'vue'
import { useAppStore } from '@/store/use-app-store'
import { useUserStore } from '@/store/use-user-store'

const appStore = useAppStore()
const userStore = useUserStore()
const accessModeText = computed(() => {
  return appStore.accessMode === 'frontend' ? '前端权限控制' : '后端权限控制'
})

const accessModeOptions = [
  { label: '前端权限控制', value: 'frontend' },
  { label: '后端权限控制', value: 'backend' },
]
</script>

<template>
  <div class="flex flex-col gap-16px">
    <n-card title="切换权限模式">
      <div class="flex gap-8px">
        <n-button :disabled="appStore.accessMode === 'frontend'">
          前端权限控制
        </n-button>
        <n-button :disabled="appStore.accessMode === 'backend'">
          后端权限控制
        </n-button>
      </div>
    </n-card>
    <n-card title="切换账号">
      <div class="flex gap-8px">
        <n-button :disabled="userStore.user.roles.includes('super')">
          超级管理员
        </n-button>
        <n-button :disabled="userStore.user.roles.includes('admin')">
          普通管理员
        </n-button>
        <n-button :disabled="userStore.user.roles.includes('user')">
          普通用户
        </n-button>
      </div>
    </n-card>
  </div>
</template>
