<script setup lang='ts'>
import { computed } from 'vue'
import { HOME_ROUTE_PATH } from '@/router/routes'
import Fallback403 from './403.vue'
import Fallback404 from './404.vue'
import Fallback500 from './500.vue'

interface Props {
  title?: string
  description?: string
  type: '403' | '404' | '500'
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  description: '',
})

const title = computed(() => {
  switch (props.type) {
    case '403':
      return '访问被拒绝'
    case '404':
      return '页面不存在'
    case '500':
      return '服务器错误'
    default:
      return ''
  }
})

const description = computed(() => {
  switch (props.type) {
    case '403':
      return '您没有权限访问此页面'
    case '404':
      return '您访问的页面未找到'
    case '500':
      return '服务器开小差了，请稍后再试'
    default:
      return ''
  }
})
</script>

<template>
  <div class="size-full flex items-center justify-center">
    <div class="flex flex-col items-center text-center space-y-8 max-w-lg w-full">
      <div class="w-72 h-56 sm:w-80 sm:h-60 lg:w-96 lg:h-72 mx-auto">
        <fallback-403 v-if="type === '403'" />
        <fallback-404 v-else-if="type === '404'" />
        <fallback-500 v-else-if="type === '500'" />
      </div>
      <div class="space-y-4">
        <div
          v-if="title"
          class="text-xl font-medium text-text-1"
        >
          {{ title }}
        </div>
        <div
          v-if="description"
          class="text-sm text-text-3 max-w-md"
        >
          {{ description }}
        </div>
      </div>
      <div class="flex flex-wrap gap-3 justify-center pt-4">
        <n-button
          type="primary"
          @click="$router.push(HOME_ROUTE_PATH)"
        >
          返回首页
        </n-button>
      </div>
    </div>
  </div>
</template>
