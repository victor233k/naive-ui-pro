<script setup lang="tsx">
import type { SelectOption, SelectRenderLabel } from 'naive-ui'
import type { ProSelectProps, ProSelectSlots } from 'pro-naive-ui'
import { Icon } from '@iconify/vue'
import { castArray } from 'lodash-es'
import { NButton } from 'naive-ui'
import { ProSelect, useForwardRef, useProField } from 'pro-naive-ui'
import { computed, h, ref } from 'vue'
import { useProRequest } from '@/composables/use-pro-request'
import { Api } from './index.api'
import { proIconifyIconsProps } from './props'

defineOptions({
  name: 'ProIconifyIcons2',
})

const props = defineProps(proIconifyIconsProps)

defineSlots<ProSelectSlots>()

const forwardRef = useForwardRef()

const {
  field,
} = useProField(props, 'ProSelect')

const {
  cancel,
  loading,
  data: icons,
  run: queryIcons,
} = useProRequest(
  async (query: string, limit: number = 50) => {
    limit = props.fieldProps?.limit ?? limit
    const res = await Api.queryIcons(query, limit)
    return res.data.icons
  },
  {
    manual: true,
    debounceWait: 300,
  },
)

const searching = ref(false)

function handleSearch(query: string) {
  searching.value = !!query
  if (!query) {
    cancel()
    icons.value = []
    return
  }
  queryIcons(query)
}

/**
 * 解决手动赋值回显逻辑
 */
const options = computed(() => {
  const set = new Set([
    ...castArray(searching.value ? [] : field.value.value || []),
    ...(icons.value ?? []),
  ])
  return [...set].map(icon => ({ label: icon, value: icon } as SelectOption))
})

const renderLabel: SelectRenderLabel = (option) => {
  return (
    <div class="flex items-center">
      <NButton
        circle
        size="small"
        bordered={false}
        renderIcon={() => {
          return <Icon icon={option.value as string} />
        }}
      />
      <span>{option.label!}</span>
    </div>
  )
}

const proSelectProps = computed<ProSelectProps>(() => {
  const { limit, ...fieldProps } = props.fieldProps ?? {}
  return {
    ...props,
    ref: forwardRef,
    fieldInstance: field,
    fieldProps: {
      ...fieldProps,
      remote: true,
      filterable: true,
      loading: loading.value,
      options: options.value,
      onSearch: handleSearch,
      renderLabel,
    },
  }
})
</script>

<template>
  <component :is="h(ProSelect, proSelectProps, $slots)" />
</template>
