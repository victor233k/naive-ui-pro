<script setup lang='tsx'>
import type { ProConfigProviderProps } from 'pro-naive-ui'
import { dateEnUS, dateZhCN } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { enUS, zhCN } from 'pro-naive-ui'
import { computed } from 'vue'
import { useAppStore } from '@/store/use-app-store'
import { useLayoutStore } from '@/store/use-layout-store'
import { useThemeStore } from '@/store/use-theme-store'

const {
  themeProps,
} = storeToRefs(useThemeStore())

const {
  isZhCN,
} = storeToRefs(useAppStore())

const {
  mobile,
} = storeToRefs(useLayoutStore())

const configProviderProps = computed<ProConfigProviderProps>(() => {
  return {
    abstract: true,
    ...themeProps.value,
    propOverrides: {
      ProButton: {
        focusable: false,
      },
      ProDataTable: {
        size: 'small',
        flexHeight: !mobile.value,
        pagination: {
          pageSlot: mobile.value ? 6 : undefined,
        },
      },
      ProModalForm: {
        preset: 'card',
        labelPlacement: 'left',
        labelWidth: '100',
      },
    },
    locale: isZhCN.value ? zhCN : enUS,
    dateLocale: isZhCN.value ? dateZhCN : dateEnUS,
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
