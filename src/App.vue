<script setup lang="ts">
import AppProvider from '@/components/app-provider/index.vue'
import Layout from '@/components/layout/index.vue'
import PerferenceDrawer from '@/components/preference-drawer/index.vue'
</script>

<template>
  <AppProvider class="h-full">
    <Layout />
    <PerferenceDrawer />
  </AppProvider>
</template>
