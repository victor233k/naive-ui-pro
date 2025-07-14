<script setup lang="ts">
import { useLeaveConfirmStore } from '@/store/use-leave-onfirm'

defineOptions({ name: 'r-list' })

const { add } = useLeaveConfirmStore()
</script>

<template>
  <div>
    当前页面:r-list
    <n-button @click="add('basic-demo')">
      添加离开提示
    </n-button>
    <n-button @click="$router.go(-1)">
      返回
    </n-button>
  </div>
</template>
