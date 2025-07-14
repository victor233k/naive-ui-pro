<script setup lang='tsx'>
import { useLeaveConfirmStore } from '@/store/use-leave-onfirm'
import { IFrameRouterView } from '@/views/iframe'

const { getLeaveConfirmList } = useLeaveConfirmStore()
</script>

<template>
  <div>
    <IFrameRouterView />
    <router-view v-slot="{ Component }">
      <div>{{ `面包屑内容 ${$router.breadcrumbs.value.map(t => t.title).join(' / ')}` }}</div>
      <div>{{ `当前缓存组件名称 ${$router.keepAliveList.value}` }}</div>
      <div>{{ `离开页面需要二次提示弹窗组件名称 ${getLeaveConfirmList()}` }}</div>
      <keep-alive :include="$router.keepAliveList.value">
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </div>
</template>
