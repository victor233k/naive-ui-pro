<script setup lang="ts">
defineOptions({ name: 'basic-list-item' })
</script>

<template>
  <div>
    当前页面: basic-list-item
    <n-button @click="$router.go(-1)">
      返回
    </n-button>
  </div>
</template>
