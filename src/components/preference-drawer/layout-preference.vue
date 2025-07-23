<script setup lang='tsx'>
import type { ProLayoutMode } from 'pro-naive-ui'
import { storeToRefs } from 'pinia'
import { useLayoutStore } from '@/store/use-layout-store'

const {
  mode,
  showNav,
  showLogo,
  navFixed,
  navHeight,
  collapsed,
  showTabbar,
  showFooter,
  showSidebar,
  footerFixed,
  footerHeight,
  tabbarHeight,
  sidebarWidth,
  sidebarCollapsedWidth,
  sidebarCollapsedShowMenuTitle,
} = storeToRefs(useLayoutStore())

const layoutOptions: Array<{ label: string, value: ProLayoutMode }> = [
  { label: '垂直布局', value: 'vertical' },
  { label: '水平布局', value: 'horizontal' },
  { label: '混合双栏布局', value: 'mixed-two-column' },
  { label: '侧边栏布局', value: 'sidebar' },
  { label: '混合侧边栏布局', value: 'mixed-sidebar' },
  { label: '内容全屏布局', value: 'full-content' },
  { label: '双栏布局', value: 'two-column' },
]
</script>

<template>
  <n-flex
    vertical
    :size="12"
    class="my-24px"
  >
    <div class="preference-item">
      <span>显示logo</span>
      <n-switch v-model:value="showLogo" />
    </div>
    <div class="preference-item">
      <span>布局模式</span>
      <n-select
        v-model:value="mode"
        class="w-150px"
        :options="layoutOptions"
      />
    </div>
  </n-flex>

  <n-flex
    vertical
    :size="12"
    class="my-24px"
  >
    <div class="font-bold text-16px">
      顶栏
    </div>
    <n-flex
      vertical
      :size="12"
      class="pl-8px"
    >
      <div class="preference-item">
        <span>显示顶栏</span>
        <n-switch v-model:value="showNav" />
      </div>
      <div class="preference-item">
        <span>固定顶栏</span>
        <n-switch v-model:value="navFixed" />
      </div>
      <div class="preference-item">
        <span>顶栏高度</span>
        <n-input-number
          v-model:value="navHeight"
          class="w-120px"
          placeholder="请输入"
        />
      </div>
    </n-flex>
  </n-flex>

  <n-flex
    vertical
    :size="12"
    class="my-24px"
  >
    <div class="font-bold text-16px">
      标签栏
    </div>
    <n-flex
      vertical
      :size="12"
      class="pl-8px"
    >
      <div class="preference-item">
        <span>显示标签栏</span>
        <n-switch v-model:value="showTabbar" />
      </div>
      <div class="preference-item">
        <span>标签栏高度</span>
        <n-input-number
          v-model:value="tabbarHeight"
          class="w-120px"
          placeholder="请输入"
        />
      </div>
    </n-flex>
  </n-flex>

  <n-flex
    vertical
    :size="12"
    class="my-24px"
  >
    <div class="font-bold text-16px">
      侧边栏
    </div>
    <n-flex
      vertical
      :size="12"
      class="pl-8px"
    >
      <div class="preference-item">
        <span>显示侧边栏</span>
        <n-switch v-model:value="showSidebar" />
      </div>
      <div class="preference-item">
        <span>折叠侧边栏</span>
        <n-switch v-model:value="collapsed" />
      </div>
      <div class="preference-item">
        <span>折叠后显示菜单名</span>
        <n-switch v-model:value="sidebarCollapsedShowMenuTitle" />
      </div>
      <div class="preference-item">
        <span>侧边栏宽度</span>
        <n-input-number
          v-model:value="sidebarWidth"
          class="w-120px"
          placeholder="请输入"
        />
      </div>
      <div class="preference-item">
        <span>折叠后宽度</span>
        <n-input-number
          v-model:value="sidebarCollapsedWidth"
          class="w-120px"
          placeholder="请输入"
        />
      </div>
    </n-flex>
  </n-flex>

  <n-flex
    vertical
    :size="12"
    class="my-24px"
  >
    <div class="font-bold text-16px">
      底部
    </div>
    <n-flex
      vertical
      :size="12"
      class="pl-8px"
    >
      <div class="preference-item">
        <span>显示底部</span>
        <n-switch v-model:value="showFooter" />
      </div>
      <div class="preference-item">
        <span>固定底部</span>
        <n-switch v-model:value="footerFixed" />
      </div>
      <div class="preference-item">
        <span>底部高度</span>
        <n-input-number
          v-model:value="footerHeight"
          class="w-120px"
          placeholder="请输入"
        />
      </div>
    </n-flex>
  </n-flex>
</template>
