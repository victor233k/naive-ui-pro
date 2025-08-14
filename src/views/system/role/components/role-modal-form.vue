<script setup lang="ts">
import { translateOptions } from '@/utils/common'
import { statusOptions } from '../utils/constants'
</script>

<template>
  <pro-input
    :title="$t('pages.system.role.roleName')"
    path="name"
    :tooltip="$t('pages.system.role.roleNameTooltip')"
    required
  />
  <pro-input
    :title="$t('pages.system.role.roleCode')"
    path="code"
    :tooltip="$t('pages.system.role.roleCodeTooltip')"
    required
  />
  <pro-radio-group
    :title="$t('common.often.status')"
    path="status"
    required
    :field-props="{
      options: translateOptions(statusOptions),
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
