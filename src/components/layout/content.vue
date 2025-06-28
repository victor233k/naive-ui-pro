<script setup lang='tsx'>
import { computed } from 'vue'
import { useBreadcrumbStore } from '@/store/use-breadcrumb.ts'
import { useLeaveConfirmStore } from '@/store/use-leave-onfirm'
import { useRoutesKeepAliveStore } from '@/store/use-routes-keep-alive'
import { IFrameRouterView } from '@/views/iframe'

const { getBreadcrumbs } = useBreadcrumbStore()
const { getKeepAliveList } = useRoutesKeepAliveStore()
const { getLeaveConfirmList } = useLeaveConfirmStore()
const breadcrumbs = computed(() => {
  return getBreadcrumbs().map(t => t.title).join(' / ')
})
</script>

<template>
  <div>
    <IFrameRouterView />
    <router-view v-slot="{ Component }">
      <div>{{ `面包屑内容 ${breadcrumbs}` }}</div>
      <div>{{ `当前缓存组件名称 ${getKeepAliveList()}` }}</div>
      <div>{{ `离开页面需要二次提示弹窗组件名称 ${getLeaveConfirmList()}` }}</div>
      <keep-alive :include="getKeepAliveList()">
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </div>
</template>
