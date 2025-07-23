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
  <pro-config-provider
    v-bind="configProviderProps"
    abstract
  >
    <n-loading-bar-provider>
      <n-message-provider>
        <n-notification-provider>
          <n-modal-provider>
            <n-dialog-provider>
              <slot />
            </n-dialog-provider>
          </n-modal-provider>
        </n-notification-provider>
      </n-message-provider>
    </n-loading-bar-provider>
  </pro-config-provider>
</template>
