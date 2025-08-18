<script setup lang="ts">
import { Icon } from '@iconify/vue'
</script>

<template>
  <n-breadcrumb>
    <n-breadcrumb-item
      v-for="breadcrumb in $router.buildBreadcrumbs()"
      :key="breadcrumb.path"
    >
      <n-icon v-if="breadcrumb.icon">
        <icon :icon="breadcrumb.icon" />
      </n-icon>
      {{ breadcrumb.title }}
    </n-breadcrumb-item>
  </n-breadcrumb>
</template>
