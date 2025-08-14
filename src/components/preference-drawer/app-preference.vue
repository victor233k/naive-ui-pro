<script setup lang='tsx'>
import type { RouteTransitionName } from '@pro/router'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { $t } from '@/locales/locales'
import { useAppStore } from '@/store/use-app-store'

const {
  transitionName,
} = storeToRefs(useAppStore())

const transitionOptions = computed<Array<{ label: string, value: RouteTransitionName }>>(() => [
  { label: $t('common.preference.app.fade'), value: 'fade' },
  { label: $t('common.preference.app.fadeUp'), value: 'fade-up' },
  { label: $t('common.preference.app.fadeDown'), value: 'fade-down' },
  { label: $t('common.preference.app.fadeSlide'), value: 'fade-slide' },
  { label: $t('common.preference.app.none'), value: 'none' },
])
</script>

<template>
  <n-flex
    vertical
    :size="12"
    class="my-24px"
  >
    <div class="preference-item">
      <span>{{ $t('common.preference.app.routeTransition') }}</span>
      <n-select
        v-model:value="transitionName"
        class="w-150px"
        :options="transitionOptions"
      />
    </div>
  </n-flex>
</template>
