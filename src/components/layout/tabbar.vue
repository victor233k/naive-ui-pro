<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useLayoutStore } from '@/store/use-layout-store'
import Tabs from './tabs/index.vue'

const isFullscreen = ref(false)

const {
  showNav,
  showSidebar,
} = storeToRefs(useLayoutStore())

function handleFullscreen() {
  if (isFullscreen.value) {
    showNav.value = true
    showSidebar.value = true
  }
  else {
    showNav.value = false
    showSidebar.value = false
  }
  isFullscreen.value = !isFullscreen.value
}
</script>

<template>
  <div class="tabbar">
    <tabs class="tabbar__tabs" />
    <div class="tabbar__actions">
      <pro-button
        quaternary
        size="small"
        @click="handleFullscreen"
      >
        <template #icon>
          <n-icon>
            <icon :icon="isFullscreen ? 'mingcute:fullscreen-exit-line' : 'mingcute:fullscreen-line'" />
          </n-icon>
        </template>
      </pro-button>
      <pro-button
        quaternary
        size="small"
        @click="$router.refresh()"
      >
        <template #icon>
          <n-icon>
            <icon icon="mingcute:refresh-1-line" />
          </n-icon>
        </template>
      </pro-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.tabbar {
  width: 100%;
  display: flex;
  align-items: center;
  height: 100%;
  box-sizing: border-box;

  &__tabs {
    flex: 1;
  }

  &__actions {
    display: flex;
    align-items: center;
    height: 100%;
    margin-right: 8px;
  }
}
</style>
