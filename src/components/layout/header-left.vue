<script setup lang='tsx'>
import { MenuFoldOutlined, MenuOutlined, MenuUnfoldOutlined, ReloadOutlined } from '@vicons/antd'
import { storeToRefs } from 'pinia'
import { useLayoutStore } from '@/store/use-layout'

const { collapsed, showSidebar } = storeToRefs(useLayoutStore())
</script>

<template>
  <div class="pl-8px flex items-center h-full">
    <pro-button
      quaternary
      size="small"
      :tooltip="collapsed ? '展开侧边栏' : '收起侧边栏'"
      @click="collapsed = !collapsed"
    >
      <template #icon>
        <n-icon>
          <MenuUnfoldOutlined v-if="collapsed" />
          <MenuFoldOutlined v-else />
        </n-icon>
      </template>
    </pro-button>
    <pro-button
      quaternary
      circle
      tooltip="刷新页面"
    >
      <template #icon>
        <n-icon>
          <ReloadOutlined />
        </n-icon>
      </template>
    </pro-button>
    <pro-button
      quaternary
      size="small"
      :tooltip="showSidebar ? '隐藏侧边栏' : '显示侧边栏'"
      @click="showSidebar = !showSidebar"
    >
      <template #icon>
        <n-icon>
          <MenuOutlined />
        </n-icon>
      </template>
    </pro-button>
  </div>
</template>
