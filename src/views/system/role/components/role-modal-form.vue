<script setup lang="ts">
import { statusOptions } from '../utils/constants'
</script>

<template>
  <pro-input
    title="角色名"
    path="name"
    tooltip="角色名"
    required
  />
  <pro-input
    title="角色编码"
    path="code"
    tooltip="角色编码"
    required
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
