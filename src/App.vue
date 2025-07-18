<script setup lang="ts">
import AppProvider from '@/components/app-provider/index.vue'
import PreferenceDrawer from '@/components/preference-drawer/index.vue'
</script>

<template>
  <AppProvider>
    <RouterView />
    <PreferenceDrawer />
  </AppProvider>
</template>
