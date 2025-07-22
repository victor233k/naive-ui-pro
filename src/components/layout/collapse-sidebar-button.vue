<script setup lang='tsx'>
import { Icon } from '@iconify/vue'
import { storeToRefs } from 'pinia'
import { useLayoutStore } from '@/store/use-layout-store'

const { collapsed } = storeToRefs(useLayoutStore())
</script>

<template>
  <pro-button
    size="small"
    secondary
    @click="collapsed = !collapsed"
  >
    <template #icon>
      <n-icon :size="14">
        <icon :icon="collapsed ? 'fa6-solid:angles-right' : 'fa6-solid:angles-left'" />
      </n-icon>
    </template>
  </pro-button>
</template>
