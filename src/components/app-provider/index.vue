<script setup lang='tsx'>
import type { ProConfigProviderProps } from 'pro-naive-ui'
import { merge } from 'lodash-es'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useThemeStore } from '@/store/use-theme-store'

const { themeProps } = storeToRefs(useThemeStore())

// TODO: 移动到 themeStore 中
const configProviderProps = computed<ProConfigProviderProps>(() => {
  return {
    ...merge(themeProps.value, {
      themeOverrides: {
        common: {
          borderRadius: '6px',
        },
      },
    }),
    propOverrides: {
      ProButton: {
        focusable: false,
      },
    },
  }
})
</script>

<template>
  <ProConfigProvider v-bind="configProviderProps">
    <slot />
  </ProConfigProvider>
</template>
