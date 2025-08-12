<script setup lang="tsx">
import type { SelectRenderLabel } from 'naive-ui'
import type { ProSelectProps, ProSelectSlots } from 'pro-naive-ui'
import { Icon } from '@iconify/vue'
import { NButton } from 'naive-ui'
import { ProSelect, useForwardRef, useProField } from 'pro-naive-ui'
import { computed, h, watch } from 'vue'
import { useProRequest } from '@/composables/use-pro-request'
import { Api } from './index.api'
import { proIconifyIconsProps } from './props'

defineOptions({
  name: 'ProIconifyIcons',
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
    return res.data.icons.map(icon => ({ label: icon, value: icon }))
  },
  {
    manual: true,
    debounceWait: 300,
  },
)

function handleSearch(query: string) {
  if (!query.length) {
    icons.value = []
    cancel()
    return
  }
  queryIcons(query)
}

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
      options: icons.value ?? [],
      onSearch: handleSearch,
      renderLabel,
    },
  }
})

/**
 * 解决手动赋值回显逻辑
 */
watch(field.value, (query: string | string[] | undefined) => {
  if (
    !query
    || !query.length
    || field.touching // 判断是否为手动交互而非 js 交互
  ) {
    return
  }
  if (props.fieldProps?.multiple) {
    query = query[query.length - 1]
  }
  const index = (icons.value ?? []).findIndex(icon => icon.value === query)
  if (!~index) {
    queryIcons(query as string)
  }
}, { flush: 'sync', immediate: true })
</script>

<template>
  <component :is="h(ProSelect, proSelectProps, $slots)" />
</template>
