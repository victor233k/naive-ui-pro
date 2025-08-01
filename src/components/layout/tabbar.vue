<script setup lang="tsx">
import type { Tab } from '@/store/use-tabs-store'
import { Icon } from '@iconify/vue'
import { useEventListener } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useLayoutStore } from '@/store/use-layout-store'
import { CACHE_KEY, useTabsStore } from '@/store/use-tabs-store'
import { useTabContextMenu } from './composables/use-tab-context-menu'
import { useTabScroll } from './composables/use-tab-scroll'
import { useTabbarTransition } from './composables/use-tab-transition'
import { useTabs } from './composables/use-tabs'

const tabsStore = useTabsStore()
const { tabs } = storeToRefs(tabsStore)

const {
  showNav,
  tabbarCache,
  tabbarTheme,
  showSidebar,
} = storeToRefs(useLayoutStore())

const {
  transitionProps,
} = useTabbarTransition()

const {
  tabbarRef,
  tabListRef,
  handleWheel,
  scrollbarRef,
} = useTabScroll()

const {
  showDropdown,
  dropdownPosition,
  handleContextMenu,
  handleDropdownSelect,
  createDropdownOptions,
} = useTabContextMenu()

const {
  handleActiveTab,
  handleRemoveTab,
  handleToggleAffix,
} = useTabs()

const isFullscreen = ref(false)

function handleTabClick(index: number, tab: Tab) {
  if (!tab.active) {
    handleActiveTab(index)
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

tabsStore.initTabs()

useEventListener('beforeunload', () => {
  if (!tabbarCache.value) {
    localStorage.removeItem(CACHE_KEY)
    return
  }
  tabsStore.cacheTabs()
})
</script>

<template>
  <div
    ref="tabbarRef"
    class="tabbar"
  >
    <n-scrollbar
      ref="scrollbarRef"
      x-scrollable
      class="tabbar__scrollbar"
      :builtin-theme-overrides="{
        width: '0px',
        height: '0px',
        railColor: 'transparent',
      }"
      :content-style="{ height: '100%' }"
      @wheel.prevent="handleWheel"
    >
      <div
        ref="tabListRef"
        class="tabbar__list"
        :class="[`tabbar__list--${tabbarTheme}`]"
      >
        <transition-group
          v-bind="transitionProps"
        >
          <div
            v-for="(tab, index) in tabs"
            :key="tab.fullPath"
            class="tabbar__item"
            :class="[
              tab.active ? 'tabbar__item--active' : '',
            ]"
            @click="handleTabClick(index, tab)"
            @contextmenu.prevent="handleContextMenu(index, $event)"
          >
            <icon
              v-if="tab.icon"
              :icon="tab.icon"
              class="tabbar__item__icon"
            />
            <span>{{ tab.title }}</span>
            <icon
              v-if="tab.affix"
              class="tabbar__item__extra"
              icon="mdi:pin-outline"
              @click="handleToggleAffix(index)"
            />
            <icon
              v-if="!tab.affix && tabs.length > 1"
              class="tabbar__item__extra"
              icon="mdi:close"
              @click="handleRemoveTab(index)"
            />
          </div>
        </transition-group>
      </div>
    </n-scrollbar>
    <div class="tabbar__actions">
      <pro-button
        quaternary
        circle
        size="small"
        @click="handleFullscreen"
      >
        <template #icon>
          <icon :icon="isFullscreen ? 'mdi:fullscreen-exit' : 'mdi:fullscreen'" />
        </template>
      </pro-button>
      <pro-button
        quaternary
        circle
        size="small"
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

<style scoped lang="scss">
.tabbar {
  display: flex;
  width: 100%;

  &__list {
    display: flex;
    height: 100%;
    padding: 0 14px;
    position: relative;
    white-space: nowrap;
  }

  &__item {
    position: relative;
    padding: 0 14px;
    cursor: pointer;
    display: flex;
    align-items: center;
    transition:
      color 0.3s ease,
      box-shadow 0.3s ease,
      background-color 0.3s ease;

    &:hover:not(.tabbar__item--active) {
      background-color: #f4f4f5;
    }

    &--active {
      background-color: #d9e9fb;
      color: #2480ea;
    }

    &__icon {
      margin-right: 6px;
    }

    &__extra {
      margin-left: 6px;
      color: #35383d;
    }
  }

  // Chrome 风格
  &__list--chrome {
    padding-top: 4px;

    .tabbar__item {
      border-radius: 12px 12px 0 0;

      &::before,
      &::after {
        position: absolute;
        bottom: 0;
        content: '';
        width: 20px;
        height: 20px;
        border-radius: 100%;
        box-shadow: 0 0 0 40px transparent;
        transition: box-shadow 0.3s ease;
      }

      &::before {
        left: -20px;
        clip-path: inset(50% -10px 0 50%);
      }

      &::after {
        right: -20px;
        clip-path: inset(50% 50% 0 -10px);
      }

      &:hover:not(.tabbar__item--active)::before,
      &:hover:not(.tabbar__item--active)::after {
        box-shadow: 0 0 0 30px #f4f4f5;
      }

      &--active {
        z-index: 1;

        &::before,
        &::after {
          box-shadow: 0 30px 0 30px #d9e9fb;
        }
      }
    }
  }

  // 卡片风格
  &__list--card {
    padding: 4px 0;

    .tabbar__item {
      margin-right: 8px;
      border-radius: 8px;
      border: 1px solid #e4e4e7;
    }
  }

  &__actions {
    display: flex;
    align-items: center;
  }
}
</style>
