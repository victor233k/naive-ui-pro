<script setup lang="ts">
import { useRouter } from 'vue-router'
import { $t } from '@/locales/locales'

const router = useRouter()

const demoFullPath = '/demos/fallback/403'

const {
  routes,
  remove,
  activeIndex,
  removes,
  guards,
} = router.visitedRoutesPlugin

function openDynamicTitleTab() {
  const timestamp = Date.now()

  const off = guards.beforeAdd((route) => {
    off()
    return {
      ...route,
      path: route.fullPath,
      meta: {
        ...route.meta,
        title: `${$t('common.layout.tabs.dynamicTitle')} #${timestamp}`,
      },
    }
  })

  router.push({
    path: demoFullPath,
    query: { timestamp: timestamp.toString() },
  })
}

function openTestPage() {
  router.push(demoFullPath)
}

function closeTestPage() {
  const index = routes.findIndex(r => r.fullPath === demoFullPath)
  if (index !== -1) {
    remove(index)
  }
}

function closeAllTabs() {
  removes(0, routes.length)
}

function closeBeforeTabs() {
  removes(0, activeIndex.value)
}

function closeAfterTabs() {
  removes(activeIndex.value + 1, routes.length)
}

function closeCurrentTab() {
  remove(activeIndex.value)
}

async function closeOtherTabs() {
  await removes(0, activeIndex.value)
  await removes(activeIndex.value + 1, routes.length)
}
</script>

<template>
  <n-space
    vertical
    size="large"
  >
    <n-card>
      <n-space vertical>
        <n-h2
          prefix="bar"
          style="margin: 0;"
        >
          {{ $t('common.layout.tabs.tabManagement') }}
        </n-h2>
        <n-text depth="3">
          {{ $t('common.layout.tabs.tabManagementDesc') }}
        </n-text>
      </n-space>
    </n-card>

    <n-space
      vertical
      size="medium"
    >
      <n-card
        :title="$t('common.layout.tabs.dynamicTabs')"
        size="small"
      >
        <template #header-extra>
          <n-tag
            type="info"
            size="small"
          >
            {{ $t('common.layout.tabs.interceptor') }}
          </n-tag>
        </template>
        <n-space vertical>
          <n-text depth="3">
            {{ $t('common.layout.tabs.dynamicTitleDesc') }}
          </n-text>
          <n-space>
            <n-button @click="openDynamicTitleTab">
              {{ $t('common.layout.tabs.createDynamicTitlePage') }}
            </n-button>
          </n-space>
        </n-space>
      </n-card>

      <n-card
        :title="$t('common.layout.tabs.openCloseTabs')"
        size="small"
      >
        <template #header-extra>
          <n-tag
            type="success"
            size="small"
          >
            {{ $t('common.layout.tabs.basic') }}
          </n-tag>
        </template>
        <n-space vertical>
          <n-text depth="3">
            {{ $t('common.layout.tabs.openCloseTabsDesc') }}
          </n-text>
          <n-space>
            <n-button @click="openTestPage">
              {{ $t('common.layout.tabs.openPage') }}
            </n-button>
            <n-button @click="closeTestPage">
              {{ $t('common.layout.tabs.closePage') }}
            </n-button>
          </n-space>
        </n-space>
      </n-card>

      <n-card
        :title="$t('common.layout.tabs.tabOperations')"
        size="small"
      >
        <template #header-extra>
          <n-tag
            type="warning"
            size="small"
          >
            {{ $t('common.layout.tabs.batch') }}
          </n-tag>
        </template>
        <n-space vertical>
          <n-text depth="3">
            {{ $t('common.layout.tabs.tabOperationsDesc') }}
          </n-text>
          <n-space>
            <n-button @click="closeCurrentTab">
              {{ $t('common.layout.tabs.closeCurrentTab') }}
            </n-button>
            <n-button @click="closeBeforeTabs">
              {{ $t('common.layout.tabs.closeLeftTabs') }}
            </n-button>
            <n-button @click="closeAfterTabs">
              {{ $t('common.layout.tabs.closeRightTabs') }}
            </n-button>
            <n-button @click="closeOtherTabs">
              {{ $t('common.layout.tabs.closeOtherTabs') }}
            </n-button>
            <n-button @click="closeAllTabs">
              {{ $t('common.layout.tabs.closeAllTabs') }}
            </n-button>
          </n-space>
        </n-space>
      </n-card>
    </n-space>
  </n-space>
</template>
