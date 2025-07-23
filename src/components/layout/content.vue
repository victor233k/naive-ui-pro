<script setup lang='tsx'>
</script>

<template>
  <router-view v-slot="{ Component }">
    <keep-alive :include="$router.keepAliveList.value">
      <component
        :is="Component"
        :key="$router.getRouteKey()"
      />
    </keep-alive>
  </router-view>
</template>
