<script setup lang='tsx'>
import type { RouteTransitionName } from '@pro/router'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/store/use-app-store'

const {
  transitionName,
} = storeToRefs(useAppStore())

const transitionOptions: Array<{ label: string, value: RouteTransitionName }> = [
  { label: '渐变', value: 'fade' },
  { label: '渐变-向上', value: 'fade-up' },
  { label: '渐变-向下', value: 'fade-down' },
  { label: '渐变-向左', value: 'fade-slide' },
  { label: '无', value: 'none' },
]
</script>

<template>
  <n-flex
    vertical
    :size="12"
    class="my-24px"
  >
    <div class="preference-item">
      <span>路由过渡动画</span>
      <n-select
        v-model:value="transitionName"
        class="w-150px"
        :options="transitionOptions"
      />
    </div>
  </n-flex>
</template>
