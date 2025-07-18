<script setup lang='tsx'>
import { storeToRefs } from 'pinia'
import logo from '@/assets/logo.svg'
import { useAppStore } from '@/store/use-app-store'
import { useLayoutStore } from '@/store/use-layout-store'

const { title } = storeToRefs(useAppStore())
const { mobile, collapsed } = storeToRefs(useLayoutStore())
</script>

<template>
  <a href="javascript: void 0;" class="flex items-center gap-12px h-full pl-12px">
    <img :src="logo" class="size-32px truncate">
    <h1 v-show="!mobile && !collapsed" class="truncate text-18px">{{ title }}</h1>
  </a>
</template>
