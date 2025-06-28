<script lang="ts" setup>
import type { RouteLocationNormalized } from 'vue-router'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useTabbarStore } from '@/store/use-tabbar'

const route = useRoute()
const { getTabs } = useTabbarStore()

const iframeRoutes = computed(() => {
  return getTabs().filter(tab => !!tab.meta?.iframeSrc)
})

const showIframe = computed(() => iframeRoutes.value.length > 0)

const tabNames = computed(
  () => new Set(iframeRoutes.value.map(item => item.name)),
)

function routeShow(tabItem: RouteLocationNormalized) {
  return tabItem.name === route.name
}

function canRender(tabItem: RouteLocationNormalized) {
  const { meta, name } = tabItem
  if (
    !meta?.keepAlive
    && tabNames.value.has(name as string)
    && name !== route.name
  ) {
    return false
  }
  return getTabs().some(tab => tab.name === name)
}
</script>

<template>
  <template v-if="showIframe">
    <template v-for="item in iframeRoutes" :key="item.fullPath">
      <div
        v-if="canRender(item)"
        v-show="routeShow(item)"
        class="relative size-full"
      >
        <iframe
          :src="item.meta.iframeSrc as string"
          class="size-full"
        />
      </div>
    </template>
  </template>
</template>
