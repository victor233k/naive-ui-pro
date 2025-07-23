<script setup lang='tsx'>
</script>

<template>
  <router-view v-slot="{ Component }">
    <transition v-bind="$router.currentRouteTransitionProps.value">
      <keep-alive :include="$router.keepAliveList.value">
        <component :is="Component" />
      </keep-alive>
    </transition>
  </router-view>
</template>
