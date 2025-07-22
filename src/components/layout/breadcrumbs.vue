<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const breadcrumbs = computed(() => {
  return router.buildBreadcrumbs()
})
</script>

<template>
  <n-breadcrumb>
    <n-breadcrumb-item
      v-for="breadcrumb in breadcrumbs"
      :key="breadcrumb.path"
    >
      <n-icon v-if="breadcrumb.icon">
        <icon :icon="breadcrumb.icon" :color="breadcrumb.iconColor" />
      </n-icon>
      {{ breadcrumb.title }}
    </n-breadcrumb-item>
  </n-breadcrumb>
</template>
