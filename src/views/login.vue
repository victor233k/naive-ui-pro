<script setup lang="ts">
defineOptions({ name: 'Login' })
</script>

<template>
  <span>login</span>
  <n-button @click="$router.go(-1)">
    返回
  </n-button>
</template>
