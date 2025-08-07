<script setup lang="tsx">
import { computed, h, shallowRef, type VNodeChild } from 'vue'
import { proIconSelectProps, type ProIconSelectSlots } from './interface'
import { ProSelect, useInjectProForm, type ProSelectInst } from 'pro-naive-ui'
import { useProRequest } from '@/composables/use-pro-request'
import { Api } from './index.api'
import { castArray, get } from 'lodash-es'
import type { SelectOption } from 'naive-ui'
import { Icon } from '@iconify/vue'
import { useDebounceFn } from '@vueuse/core'

defineOptions({
  name: 'ProIconSelect',
})

defineSlots<ProIconSelectSlots>()

const { path, fieldProps = {} } = defineProps(proIconSelectProps)
const limit = computed(() => fieldProps.limit ?? 50)

const form = useInjectProForm()
const pathValue = computed(
  () => path && form && get(form.fieldsValue.value, path),
)

const {
  data: remoteIcons,
  loading: remoteIconsLoading,
  run: queryIcons,
} = useProRequest(
  (query: string) =>
    Api.queryIcons({ query, limit: limit.value }).then((res) => res.data.icons),
  {
    manual: true,
  },
)

const handleSearch = useDebounceFn((query: string) => {
  if (!query) {
    remoteIcons.value = []
    return
  }
  queryIcons(query)
})

const options = computed(() => {
  const set = new Set([
    ...castArray(pathValue.value || []),
    ...(remoteIcons.value || []),
  ])
  return [...set].map((icon) => ({ label: icon, value: icon } as SelectOption))
})

const renderLabel = (option: SelectOption): VNodeChild => {
  if (option.type === 'group') {
    return <span>{option.label}</span>
  }

  return (
    <n-flex
      align="center"
      size="small"
    >
      <Icon icon={option.value as string} />
      <span>{option.label}</span>
    </n-flex>
  )
}

const selectRef = shallowRef<ProSelectInst>()
defineExpose(
  new Proxy({} as ProSelectInst, {
    get: (_target, key) => selectRef.value?.[key as keyof ProSelectInst],
    has: (_target, key) => key in (selectRef.value || {}),
  }),
)
</script>

<template>
  <component
    ref="selectRef"
    :is="
      h(
        ProSelect,
        {
          ...$props,
          fieldProps: {
            renderLabel,
            ...($props.fieldProps || {}),
            options,
            remote: true,
            filterable: true,
            loading: remoteIconsLoading,
            onSearch: handleSearch,
            limit: undefined,
          },
        },
        $slots,
      )
    "
  />
</template>
