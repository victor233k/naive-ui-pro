<script setup lang='tsx'>
import { Icon } from '@iconify/vue'
import { storeToRefs } from 'pinia'
import { useThemeStore } from '@/store/use-theme-store'

const {
  themeMode,
  grayscale,
  primaryColor,
  colorWeakness,
} = storeToRefs(useThemeStore())
</script>

<template>
  <div class="px-32px my-24px">
    <n-tabs v-model:value="themeMode" type="segment" animated>
      <n-tab-pane name="light">
        <template #tab>
          <n-icon size="20">
            <icon icon="ri:sun-fill" />
          </n-icon>
        </template>
      </n-tab-pane>
      <n-tab-pane name="dark">
        <template #tab>
          <n-icon size="20">
            <icon icon="fa6-solid:moon" />
          </n-icon>
        </template>
      </n-tab-pane>
      <n-tab-pane name="auto">
        <template #tab>
          <n-icon size="20">
            <icon icon="fluent:autocorrect-20-filled" />
          </n-icon>
        </template>
      </n-tab-pane>
    </n-tabs>
  </div>
  <n-flex vertical :size="12">
    <div class="preference-item">
      <span>色弱模式</span>
      <n-switch v-model:value="colorWeakness" />
    </div>
    <div class="preference-item">
      <span>灰色模式</span>
      <n-switch v-model:value="grayscale" />
    </div>
    <div class="preference-item">
      <span>主色</span>
      <n-color-picker v-model:value="primaryColor" class="w-90px" />
    </div>
  </n-flex>
</template>
