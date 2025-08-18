<script setup lang='tsx'>
</script>

<template>
  <router-view
    v-slot="{ Component }"
    :route="$router.resolveNestedRoute()"
  >
    <transition v-bind="$router.currentRouteTransitionProps.value">
      <keep-alive :include="$router.cachedComponentNames.value">
        <component
          :is="Component"
          :key="$router.getRouteKey()"
        />
      </keep-alive>
    </transition>
  </router-view>
</template>
