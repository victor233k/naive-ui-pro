<script setup lang="ts">
import { useProRequest } from '@/composables/use-pro-request'
import { genderOptions, statusOptions } from './constants'
import { apiGetRoles } from './user.api'

const {
  data: roleOptions,
} = useProRequest(() => {
  return apiGetRoles().then(res => res.data.map(item => ({
    value: item.id,
    label: item.name,
  })))
})
</script>

<template>
  <pro-input
    title="用户名"
    path="username"
    tooltip="用户名"
    required
  />
  <pro-input
    title="用户昵称"
    path="nickname"
    required
  />
  <pro-radio-group
    title="性别"
    path="gender"
    required
    :field-props="{
      options: genderOptions,
    }"
  />
  <pro-password
    title="密码"
    path="password"
    required
    :field-props="{
      showPasswordOn: 'click',
    }"
  />
  <pro-select
    title="所属角色"
    path="roleIds"
    required
    :field-props="{
      options: roleOptions,
      multiple: true,
    }"
  />
  <pro-radio-group
    title="状态"
    path="status"
    required
    :field-props="{
      options: statusOptions,
    }"
  />
  <pro-input
    title="邮箱"
    path="email"
  />
  <pro-input
    title="手机号"
    path="phone"
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
