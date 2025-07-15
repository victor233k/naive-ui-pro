<script setup lang='tsx'>
import { preferenceConfig } from '@root/preference'
import { storeToRefs } from 'pinia'
import logo from '@/assets/logo.svg'
import { useLayoutStore } from '@/store/use-layout-store'

const { mobile, collapsed } = storeToRefs(useLayoutStore())
</script>

<template>
  <a href="javascript: void 0;" class="flex items-center gap-12px h-full pl-12px">
    <img :src="logo" class="size-32px truncate">
    <h1 v-show="!mobile && !collapsed" class="truncate text-18px">{{ preferenceConfig.title }}</h1>
  </a>
</template>
