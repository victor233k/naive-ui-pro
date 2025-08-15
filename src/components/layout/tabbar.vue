<script setup lang="tsx">
import { Icon } from '@iconify/vue'
import { useEventListener } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useLayoutStore } from '@/store/use-layout-store'
import { useTabContextMenu } from './composables/use-tab-context-menu'
import { TABS_CACHE_KEY } from './constants'

const router = useRouter()

const {
  routes,
  activeKey,
  setActiveKey,
  initAndEnsureActiveKey,
  removeAndEnsureActiveKey,
  toggleVisitedRouteLockedState,
} = router.visitedRoutes

const {
  showNav,
  tabbarCache,
  showSidebar,
} = storeToRefs(useLayoutStore())

const {
  showDropdown,
  dropdownPosition,
  handleContextMenu,
  handleDropdownSelect,
  createDropdownOptions,
} = useTabContextMenu()

const isFullscreen = ref(false)

const tabsValue = computed(() => routes.value.map(route => ({
  name: route.fullPath,
  label: String(route.meta?.title || route.name || route.path),
  icon: route.meta?.icon,
  locked: route.meta?.locked,
  closable: !route.meta?.locked && routes.value.length > 1,
})))

function handleTabChange(value: string) {
  setActiveKey(value)
  router.push(value)
}

function handleTabClose(name: string) {
  const index = routes.value.findIndex(route => route.fullPath === name)
  if (index !== -1) {
    removeAndEnsureActiveKey(index)
  }
}

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

function handleTabContextMenu(name: string, e: MouseEvent) {
  const index = routes.value.findIndex(route => route.fullPath === name)
  if (index !== -1) {
    handleContextMenu(index, e)
  }
}

function renderTabLabel(tab: { name: string, label: string, icon?: string, locked?: boolean }) {
  return () => (
    <div
      class="flex items-center gap-8px"
      onContextmenu={(e: MouseEvent) => {
        e.preventDefault()
        handleTabContextMenu(tab.name, e)
      }}
    >
      {tab.icon && <Icon icon={tab.icon} class="w-16px h-16px" />}
      <span class="line-height-initial">{tab.label}</span>
      {tab.locked && (
        <span
          class="ml-16px"
          onMousedown={(e: MouseEvent) => {
            e.stopPropagation()
            const index = routes.value.findIndex(route => route.fullPath === tab.name)
            if (index !== -1) {
              toggleVisitedRouteLockedState(index)
            }
          }}
        >
          <Icon icon="mdi:pin-outline" />
        </span>
      )}
    </div>
  )
}

function initTabs() {
  const cachedTabs = localStorage.getItem(TABS_CACHE_KEY)
  if (!cachedTabs) {
    return
  }
  initAndEnsureActiveKey(JSON.parse(cachedTabs))
}

initTabs()

useEventListener('beforeunload', () => {
  if (!tabbarCache.value) {
    localStorage.removeItem(TABS_CACHE_KEY)
    return
  }
  localStorage.setItem(TABS_CACHE_KEY, JSON.stringify(routes.value))
})
</script>

<template>
  <div class="w-full flex">
    <n-tabs
      type="card"
      size="small"
      closable
      scrollable
      :value="activeKey || undefined"
      class="flex-1"
      @update:value="handleTabChange"
      @close="handleTabClose"
    >
      <n-tab-pane
        v-for="tab in tabsValue"
        :key="tab.name"
        :name="tab.name"
        :closable="tab.closable"
      >
        <template #tab>
          <component :is="renderTabLabel(tab)" />
        </template>
      </n-tab-pane>
    </n-tabs>

    <div class="flex items-center gap-4px ml-8px pr-8px">
      <pro-button
        quaternary
        @click="handleFullscreen"
      >
        <template #icon>
          <icon :icon="isFullscreen ? 'mdi:fullscreen-exit' : 'mdi:fullscreen'" />
        </template>
      </pro-button>
      <pro-button
        quaternary
        @click="$router.refresh()"
      >
        <template #icon>
          <icon icon="mdi:refresh" />
        </template>
      </pro-button>
    </div>

    <n-dropdown
      :show="showDropdown"
      :x="dropdownPosition.x"
      :y="dropdownPosition.y"
      placement="bottom-start"
      :options="createDropdownOptions()"
      @select="handleDropdownSelect"
      @clickoutside="showDropdown = false"
    />
  </div>
</template>

<!-- <style scoped lang="scss">
.tabbar {
  display: flex;
  width: 100%;
  align-items: center;

  // &__tabs {
  //   flex: 1;
  //   height: 100%;

  //   // :deep(.n-tabs-nav) {
  //   //   padding: 0;
  //   // }

  //   // :deep(.n-tabs-nav-scroll-content) {
  //   //   align-items: center;
  //   // }

  //   :deep(.n-tabs-tab) {
  //     padding: 8px 16px;
  //   }
  // }

  &__actions {
    display: flex;
    align-items: center;
    margin-left: 8px;
    gap: 4px;
  }
}

.tabbar-tab-content {
  display: flex;
  align-items: center;
  user-select: none;
  gap: 8px;
}

.tabbar-tab-icon {
  margin-right: 6px;
  font-size: 14px;
}

.tabbar-tab-label {
  margin-right: 6px;
}

.tabbar-tab-extra {
  font-size: 12px;
  color: var(--n-text-color-disabled);
  cursor: pointer;
  transition: color 0.3s;

  &:hover {
    color: var(--n-text-color);
  }
}
</style> -->
