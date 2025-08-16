<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const demoFullPath = '/demos/fallback/403'

const {
  remove,
  addBeforeAddInterceptor,
  removeAndEnsureActiveKey,
  removeAllAndEnsureActiveKey,
  removeAfterAndEnsureActiveKey,
  removeOtherAndEnsureActiveKey,
  removeBeforeAndEnsureActiveKey,
  findVisitedRouteIndexByFullPath,
} = router.visitedRoutes

function openDynamicTitleTab() {
  const timestamp = Date.now()

  addBeforeAddInterceptor((route) => {
    return {
      ...route,
      meta: {
        ...route.meta,
        title: `动态页面 #${timestamp}`,
      },
    }
  }, { once: true })

  router.push({
    path: demoFullPath,
    query: { timestamp: timestamp.toString() },
  })
}

function openTestPage() {
  router.push(demoFullPath)
}

function closeTestPage() {
  const index = findVisitedRouteIndexByFullPath(demoFullPath)
  remove(index)
}

function closeAllTabs() {
  removeAllAndEnsureActiveKey()
}

function closeBeforeTabs() {
  const index = findVisitedRouteIndexByFullPath(route.fullPath)
  removeBeforeAndEnsureActiveKey(index)
}

function closeAfterTabs() {
  const index = findVisitedRouteIndexByFullPath(route.fullPath)
  removeAfterAndEnsureActiveKey(index)
}

function closeCurrentTab() {
  const index = findVisitedRouteIndexByFullPath(route.fullPath)
  removeAndEnsureActiveKey(index)
}

function closeOtherTabs() {
  const index = findVisitedRouteIndexByFullPath(route.fullPath)
  removeOtherAndEnsureActiveKey(index)
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
          标签页管理
        </n-h2>
        <n-text depth="3">
          支持动态创建、批量操作和智能拦截
        </n-text>
      </n-space>
    </n-card>

    <n-space
      vertical
      size="medium"
    >
      <n-card
        title="动态标签页"
        size="small"
      >
        <template #header-extra>
          <n-tag
            type="info"
            size="small"
          >
            拦截器
          </n-tag>
        </template>
        <n-space vertical>
          <n-text depth="3">
            创建带时间戳的动态标题，演示一次性拦截器功能
          </n-text>
          <n-space>
            <n-button @click="openDynamicTitleTab">
              创建动态标题页面
            </n-button>
          </n-space>
        </n-space>
      </n-card>

      <n-card
        title="打开/关闭标签页"
        size="small"
      >
        <template #header-extra>
          <n-tag
            type="success"
            size="small"
          >
            基础
          </n-tag>
        </template>
        <n-space vertical>
          <n-text depth="3">
            如果存在则激活已有标签页，否则则打开新标签页
          </n-text>
          <n-space>
            <n-button @click="openTestPage">
              打开"403"页面
            </n-button>
            <n-button @click="closeTestPage">
              关闭"403"页面
            </n-button>
          </n-space>
        </n-space>
      </n-card>

      <n-card
        title="标签页操作"
        size="small"
      >
        <template #header-extra>
          <n-tag
            type="warning"
            size="small"
          >
            批量
          </n-tag>
        </template>
        <n-space vertical>
          <n-text depth="3">
            用于动态配置标签页
          </n-text>
          <n-space>
            <n-button @click="closeCurrentTab">
              关闭当前标签页
            </n-button>
            <n-button @click="closeBeforeTabs">
              关闭左侧标签页
            </n-button>
            <n-button @click="closeAfterTabs">
              关闭右侧标签页
            </n-button>
            <n-button @click="closeOtherTabs">
              关闭其他标签页
            </n-button>
            <n-button @click="closeAllTabs">
              关闭所有标签页
            </n-button>
          </n-space>
        </n-space>
      </n-card>
    </n-space>
  </n-space>
</template>
