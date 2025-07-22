<script setup lang="ts">
import AppProvider from '@/components/app-provider/index.vue'
import PreferenceDrawer from '@/components/preference-drawer/index.vue'
</script>

<template>
  <app-provider>
    <router-view />
    <preference-drawer />
  </app-provider>
</template>
