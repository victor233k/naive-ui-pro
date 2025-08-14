<script setup lang="ts">
import { useProRequest } from '@/composables/use-pro-request'
import { translateOptions } from '@/utils/common'
import { Api } from '../index.api'
import { genderOptions, statusOptions } from '../utils/constants'

const { data: roleOptions } = useProRequest(async () => {
  const res = await Api.roleList()
  return res.data.map(item => ({
    value: item.id,
    label: item.name,
  }))
})
</script>

<template>
  <pro-input
    :title="$t('pages.system.user.username')"
    path="username"
    :tooltip="$t('pages.system.user.usernameTooltip')"
    required
  />
  <pro-input
    :title="$t('pages.system.user.nickname')"
    path="nickname"
    required
  />
  <pro-radio-group
    :title="$t('pages.system.user.gender')"
    path="gender"
    required
    :field-props="{
      options: translateOptions(genderOptions),
    }"
  />
  <pro-password
    :title="$t('pages.system.user.password')"
    path="password"
    required
    :field-props="{
      showPasswordOn: 'click',
    }"
  />
  <pro-select
    :title="$t('pages.system.user.role')"
    path="roleIds"
    required
    :field-props="{
      options: roleOptions,
      multiple: true,
    }"
  />
  <pro-radio-group
    :title="$t('common.often.status')"
    path="status"
    required
    :field-props="{
      options: translateOptions(statusOptions),
    }"
  />
  <pro-input
    :title="$t('pages.system.user.email')"
    path="email"
  />
  <pro-input
    :title="$t('pages.system.user.phone')"
    path="phone"
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
