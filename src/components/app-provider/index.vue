<script setup lang='tsx'>
import type { ProConfigProviderProps } from 'pro-naive-ui'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useThemeStore } from '@/store/use-theme-store'

const {
  themeProps,
} = storeToRefs(useThemeStore())

const configProviderProps = computed<ProConfigProviderProps>(() => {
  return {
    abstract: true,
    ...themeProps.value,
    propOverrides: {
      ProButton: {
        focusable: false,
      },
    },
  }
})
</script>

<template>
  <pro-config-provider v-bind="configProviderProps">
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
