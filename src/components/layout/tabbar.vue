<script setup lang="tsx">
import type { RouteLocationNormalized } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useEventListener } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { $t } from '@/locales/locales'
import { useLayoutStore } from '@/store/use-layout-store'
import { CACHE_KEY } from '@/store/use-tabs-store'
import { useTabContextMenu } from './composables/use-tab-context-menu'
import { useTabScroll } from './composables/use-tab-scroll'
import { useTabbarTransition } from './composables/use-tab-transition'

const route = useRoute()
const router = useRouter()
const { routes, activeIndex, add, remove, removes, guards }
  = router.visitedRoutesPlugin

const { showNav, tabbarTheme, showSidebar, tabbarCache } = storeToRefs(
  useLayoutStore(),
)

const { transitionProps } = useTabbarTransition()

const { tabbarRef, tabListRef, handleWheel, scrollbarRef, updateNavScroll }
  = useTabScroll()

const {
  showDropdown,
  dropdownPosition,
  handleContextMenu,
  handleDropdownSelect,
  createDropdownOptions,
} = useTabContextMenu()

const isFullscreen = ref(false)
const isInitializing = ref(true)

async function handleToggleAffix(index: number) {
  const currentSelectVisitRoute = routes[index]
  currentSelectVisitRoute.meta.affixed = !currentSelectVisitRoute.meta?.affixed
}

function handleTabClick(index: number) {
  if (activeIndex.value !== index) {
    activeIndex.value = index
    updateNavScroll(index)
  }
}

async function handleRemoveTab(index: number) {
  const success = await remove(index)
  if (success && activeIndex.value >= 0) {
    updateNavScroll(activeIndex.value)
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

guards.beforeRemove((index) => {
  // 如果当前关闭的标签页是已固定的，则阻止关闭
  if (routes[index]?.meta?.affixed) {
    return false
  }
})

guards.afterRemove(() => {
  // 在还未进入页面初始化状态下不需要执行跳转到首页操作
  // 且没有路由时才跳转首页
  if (!isInitializing.value && !routes.length) {
    router.push('/')
  }
})

async function initTabs() {
  if (tabbarCache.value) {
    await removes(0, routes.length)
    const raw = localStorage.getItem(CACHE_KEY)
    const cachedTabs: RouteLocationNormalized[] = raw ? JSON.parse(raw) : []
    const currentFullPath = route.fullPath
    for (const tab of cachedTabs) {
      await add(tab)
    }
    const existed = cachedTabs.some(tab => tab.fullPath === currentFullPath)
    if (!existed) {
      await add(route)
    }
  }

  // 初始化完成后，将标志设置为 false
  isInitializing.value = false
}

initTabs()

useEventListener('beforeunload', () => {
  if (tabbarCache.value) {
    localStorage.setItem(CACHE_KEY, JSON.stringify(routes))
  }
  else {
    localStorage.removeItem(CACHE_KEY)
  }
})

watch(
  () => routes[activeIndex.value]?.fullPath,
  (newPath) => {
    if (newPath && route.fullPath && newPath !== route.fullPath) {
      router.push(newPath)
    }
  },
)
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
        <transition-group v-bind="transitionProps">
          <div
            v-for="(tab, index) in routes"
            :key="tab.fullPath"
            class="tabbar__item"
            :class="[activeIndex === index ? 'tabbar__item--active' : '']"
            @click="handleTabClick(index)"
            @contextmenu.prevent="handleContextMenu(index, $event)"
          >
            <icon
              v-if="tab.meta?.icon"
              :icon="tab.meta.icon"
              class="tabbar__item__icon"
            />
            <span>{{
              tab.meta?.titleI18nKey
                ? $t(tab.meta.titleI18nKey)
                : tab.meta?.title
            }}</span>
            <icon
              v-if="tab.meta?.affixed"
              class="tabbar__item__extra"
              icon="mdi:pin-outline"
              @click.stop="handleToggleAffix(index)"
            />
            <icon
              v-if="!tab.meta?.affixed && routes.length > 1"
              class="tabbar__item__extra"
              icon="mdi:close"
              @click.stop="handleRemoveTab(index)"
            />
          </div>
        </transition-group>
      </div>
    </n-scrollbar>
    <div class="tabbar__actions">
      <n-tooltip>
        <template #trigger>
          <pro-button
            quaternary
            circle
            size="small"
            @click="handleFullscreen"
          >
            <template #icon>
              <icon
                :icon="isFullscreen ? 'mdi:fullscreen-exit' : 'mdi:fullscreen'"
              />
            </template>
          </pro-button>
        </template>
        {{
          isFullscreen
            ? $t('common.layout.tabs.exitFullscreen')
            : $t('common.layout.tabs.fullscreen')
        }}
      </n-tooltip>
      <n-tooltip>
        <template #trigger>
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
        </template>
        {{ $t('common.layout.tabs.refresh') }}
      </n-tooltip>
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
