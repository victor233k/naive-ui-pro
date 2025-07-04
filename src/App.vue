<script setup lang="ts">
import AppProvider from '@/components/app-provider/index.vue'
</script>

<template>
  <AppProvider class="h-full">
    <n-dialog-provider>
      <n-message-provider>
        <RouterView />
      </n-message-provider>
    </n-dialog-provider>
  </AppProvider>
</template>
