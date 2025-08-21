<script setup lang="ts">
import { useRouter } from 'vue-router'

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

  // TODO: 拦截器返回卸载函数类型定义需修改
  let off: () => void = () => {}
  off = guards.beforeAdd((route) => {
    off()
    return {
      ...route,
      path: route.fullPath,
      meta: {
        ...route.meta,
        title: `动态页面 #${timestamp}`,
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
