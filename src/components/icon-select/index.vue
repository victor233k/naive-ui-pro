<script setup lang="tsx">
import type { SelectOption } from 'naive-ui'
import type { VNodeChild } from 'vue'
import type {
  ProIconSelectInst,
  ProIconSelectProps,
  ProIconSelectSlots,
} from './interface'
import { Icon } from '@iconify/vue'
import { useDebounceFn } from '@vueuse/core'
import { castArray, get } from 'lodash-es'
import { ProSelect, useInjectProForm } from 'pro-naive-ui'
import { computed, getCurrentInstance, h, mergeProps, ref } from 'vue'
import { useProRequest } from '@/composables/use-pro-request'
import { Api } from './index.api'
import { proIconSelectProps } from './interface'

defineOptions({
  name: 'ProIconSelect',
})

const { path, fieldProps = {} } = defineProps(proIconSelectProps)

defineSlots<ProIconSelectSlots>()

const limit = computed(() => fieldProps.limit ?? 50)

const form = useInjectProForm()
const pathValue = computed(
  () => path && form && get(form.fieldsValue.value, path),
)

const {
  data: remoteIcons,
  loading: remoteIconsLoading,
  run: queryIcons,
  cancel: cancelQueryIcons,
} = useProRequest(
  (query: string) =>
    Api.queryIcons({ query, limit: limit.value }).then(res => res.data.icons),
  {
    manual: true,
  },
)

const isSearching = ref(false)
const handleSearch = useDebounceFn((query: string) => {
  isSearching.value = !!query
  cancelQueryIcons()
  if (!query) {
    remoteIcons.value = []
    return
  }
  queryIcons(query)
})

const options = computed(() => {
  const set = new Set([
    ...castArray(isSearching.value ? [] : pathValue.value || []),
    ...(remoteIcons.value || []),
  ])
  return [...set].map(icon => ({ label: icon, value: icon } as SelectOption))
})

function renderLabel(option: SelectOption): VNodeChild {
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

const vm = getCurrentInstance()!
function selectRef(inst: ProIconSelectInst | null) {
  vm.exposed = vm.exposeProxy = inst || {}
}

defineExpose<ProIconSelectInst>()
</script>

<template>
  <component
    :is="
      h(
        ProSelect,
        {
          ...$props,
          fieldProps: mergeProps(
            {
              renderLabel,
            },
            $props.fieldProps || {},
            {
              options,
              'remote': true,
              'filterable': true,
              'loading': remoteIconsLoading,
              'limit': undefined,
              'onSearch': handleSearch,
              'onBlur': () => handleSearch(''),
              'onClear': () => handleSearch(''),
              'onUpdate:show': () => handleSearch(''),
              'onUpdate:value': () => handleSearch(''),
            } as NonNullable<ProIconSelectProps['fieldProps']>,
          ),
        },
        $slots,
      )
    "
    :ref="selectRef"
  />
</template>
