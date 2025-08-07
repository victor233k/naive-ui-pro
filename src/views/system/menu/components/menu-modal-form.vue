<script setup lang="ts">
import type { CascaderOption as _CascaderOption } from 'naive-ui'
import { ref, shallowReactive } from 'vue'
import { useProRequest } from '@/composables/use-pro-request'
import { Api } from '../index.api'
import { buildTree } from '../utils'
import { linkModeOptions, statusOptions, typeOptions } from '../utils/constants'
import { orderBy } from 'lodash-es'
import { IconSelect } from '@/components/icon-select'

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

      if (item.type === '3') continue

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
  if (!item) return false

  return (
    item.status === '0' ||
    item.id === values.id ||
    (!!item.parentId && isDisabled(idMap.get(item.parentId)))
  )
}
</script>

<template>
  <pro-radio-group
    title="菜单类型"
    path="type"
    :field-props="{
      type: 'button',
      options: typeOptions,
    }"
  />
  <pro-cascader
    title="上级菜单"
    path="parentId"
    :field-props="{
      remote: true,
      clearable: true,
      options: cascaderOptions,
    }"
  />
  <icon-select
    title="菜单图标"
    path="icon"
    required
    :hidden="values.type === '3'"
  />
  <pro-input
    title="菜单标题"
    path="title"
    required
  />
  <pro-input
    title="菜单编码"
    path="code"
    required
  />
  <template v-if="values.type !== '3'">
    <pro-input
      title="路由路径"
      path="routePath"
      required
    />
    <pro-input
      title="路由文件"
      path="routeFile"
      :tooltip="values.type === '1' ? '未设置外链时必填' : undefined"
      :hidden="!['1', '2'].includes(values.type)"
      :required="values.type !== '1'"
    />
    <pro-digit
      title="菜单排序"
      path="sort"
      required
    />
    <template v-if="values.type === '1'">
      <pro-input
        title="外链地址"
        path="link"
      />
      <pro-radio-group
        title="外链方式"
        tooltip="iframe 打开时若同时设置了路由文件，则优先使用路由文件"
        path="linkMode"
        required
        :field-props="{
          options: linkModeOptions,
        }"
      />
    </template>
  </template>
  <pro-checkbox
    title="支持缓存"
    path="keepAlive"
    :hidden="['0', '3'].includes(values.type)"
  />
  <pro-radio-group
    title="状态"
    path="status"
    required
    :field-props="{
      options: statusOptions,
    }"
  />
  <pro-textarea
    title="备注"
    path="remark"
    :field-props="{
      autosize: {
        minRows: 3,
        maxRows: 5,
      },
    }"
  />
</template>
