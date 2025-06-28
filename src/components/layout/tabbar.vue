<script setup lang='tsx'>
import { computed } from 'vue'
import { useTabbarStore } from '@/store/use-tabbar'

const useTabbar = useTabbarStore()
const tabsName = computed(() => useTabbar.getTabs().map(tab => tab.name))
</script>

<template>
  当前 tabbar 为 {{ tabsName }}
</template>
