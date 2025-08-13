<script setup lang="ts">
import type { CascaderOption as _CascaderOption } from 'naive-ui'
import { orderBy } from 'lodash-es'
import { ref, shallowReactive } from 'vue'
import { useProRequest } from '@/composables/use-pro-request'
import { Api } from '../index.api'
import { buildTree } from '../utils'
import { linkModeOptions, statusOptions, typeOptions } from '../utils/constants'

type CascaderOption = _CascaderOption & Pick<Api.Model, 'id' | 'parentId'>

const { values } = defineProps<{
  values: Api.insertOrUpdate.RequestData
}>()

const cascaderOptions = ref<CascaderOption[]>([])
const idMap = shallowReactive(new Map<string, Api.Model>())
const parentIdMap = shallowReactive(new Map<string | null, Api.Model[]>())

useProRequest(Api.list, {
  onSuccess({ data }) {
    data = orderBy(data, ['sort'], ['asc'])

    for (const item of data) {
      idMap.set(item.id, item)

      if (item.type === '3')
        continue

      const parentId = item.parentId || null
      const children = parentIdMap.get(parentId) || []
      children.push(item)
      parentIdMap.set(parentId, children)
    }

    cascaderOptions.value = buildTree(data.map(toOption))
  },
})

function toOption(item: Api.Model): CascaderOption {
  return {
    value: item.id,
    label: item.title,
    disabled: isDisabled(item),
    isLeaf: !parentIdMap.has(item.id),
    id: item.id,
    parentId: item.parentId,
  }
}

function isDisabled(item: Api.Model | undefined): boolean {
  if (!item)
    return false

  return (
    item.status === '0'
    || item.id === values.id
    || (!!item.parentId && isDisabled(idMap.get(item.parentId)))
  )
}
</script>

<template>
  <pro-radio-group
    :title="$t('pages.system.menu.menuType')"
    path="type"
    :field-props="{
      type: 'button',
      options: typeOptions,
    }"
  />
  <pro-cascader
    :title="$t('pages.system.menu.parentMenu')"
    path="parentId"
    :field-props="{
      remote: true,
      clearable: true,
      options: cascaderOptions,
    }"
  />
  <pro-iconify-icons
    :title="$t('pages.system.menu.menuIcon')"
    path="icon"
    required
    :hidden="values.type === '3'"
  />
  <pro-input
    :title="$t('pages.system.menu.menuTitle')"
    path="title"
    required
  />
  <pro-input
    :title="$t('pages.system.menu.menuCode')"
    path="code"
    required
  />
  <template v-if="values.type !== '3'">
    <pro-input
      :title="$t('pages.system.menu.routePath')"
      path="routePath"
      required
    />
    <pro-input
      :title="$t('pages.system.menu.routeFile')"
      path="routeFile"
      :tooltip="values.type === '1' ? $t('pages.system.menu.requiredWhenNoLink') : undefined"
      :hidden="!['1', '2'].includes(values.type)"
      :required="values.type !== '1'"
    />
    <pro-digit
      :title="$t('pages.system.menu.menuSort')"
      path="sort"
      required
    />
    <template v-if="values.type === '1'">
      <pro-input
        :title="$t('pages.system.menu.linkAddress')"
        path="link"
      />
      <pro-radio-group
        :title="$t('pages.system.menu.linkMethod')"
        :tooltip="$t('pages.system.menu.linkMethodTooltip')"
        path="linkMode"
        required
        :field-props="{
          options: linkModeOptions,
        }"
      />
    </template>
  </template>
  <pro-checkbox
    :title="$t('pages.system.menu.supportCache')"
    path="keepAlive"
    :hidden="['0', '3'].includes(values.type)"
  />
  <pro-radio-group
    :title="$t('common.often.status')"
    path="status"
    required
    :field-props="{
      options: statusOptions,
    }"
  />
  <pro-textarea
    :title="$t('common.often.remark')"
    path="remark"
    :field-props="{
      autosize: {
        minRows: 3,
        maxRows: 5,
      },
    }"
  />
</template>
