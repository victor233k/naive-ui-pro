<script setup lang="ts">
import type { FormRules, SelectOption } from 'naive-ui'
import { useMessage } from 'naive-ui'
import { createProForm, useRequest } from 'pro-naive-ui'
import { shallowRef } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { RoleApi } from '@/api/system/role'
import { UserApi } from '@/api/system/user'
import {
  SysEnableDisable,
  SysEnableDisableDict,
} from '@/dicts/sys-enable-disable'
import { SysUserGender, SysUserGenderDict } from '@/dicts/sys-user-gender'

const router = useRouter()
const route = useRoute()
const message = useMessage()

const roleOptions = shallowRef<SelectOption[]>([])
useRequest(RoleApi.list, {
  onSuccess({ data }) {
    roleOptions.value = data.map(item => ({
      value: item.id,
      label: item.name,
    }))
  },
})

const { loading: submitting, run: submit } = useRequest(
  UserApi.insertOrUpdate,
  {
    manual: true,
    onSuccess() {
      message.success('保存成功')
      router.back()
    },
    onError(e) {
      message.error(e.message)
    },
  },
)

const form = createProForm<UserApi.insertOrUpdate.RequestData>({
  initialValues: {
    username: '',
    nickname: '',
    password: '',
    roleIds: [],
    gender: SysUserGender.Male,
    status: SysEnableDisable.Enable,
  },
  onSubmit: () => {
    submit(form.values.value)
  },
})

const rules: FormRules = {
  username: [{ required: true }],
  nickname: [{ required: true }],
  password: [{ required: true }],
  roleIds: [{ required: true, type: 'array' }],
  gender: [{ required: true }],
  status: [{ required: true }],
}

const isUpdate = !!route.params.id
const { loading } = useRequest(() => UserApi.get(route.params.id as string), {
  manual: !isUpdate,
  onSuccess({ data }) {
    form.values.value = data
  },
  onError(e) {
    message.error(e.message)
  },
})
</script>

<template>
  <pro-card class="max-w-[500px]">
    <pro-form
      :form
      :rules
      :loading="loading || submitting"
    >
      <pro-input
        title="用户名"
        tooltip="用户名"
        path="username"
      />

      <pro-input
        title="用户昵称"
        tooltip="用户昵称"
        path="nickname"
      />

      <pro-radio-group
        title="性别"
        path="gender"
        :field-props="{ options: SysUserGenderDict.items() }"
      />

      <pro-password
        title="密码"
        tooltip="密码"
        path="password"
        :field-props="{ showPasswordOn: 'click' }"
      />

      <pro-select
        title="所属角色"
        path="roleIds"
        :field-props="{
          options: roleOptions,
          multiple: true,
        }"
      />

      <pro-radio-group
        title="状态"
        path="status"
        :field-props="{ options: SysEnableDisableDict.items() }"
      />

      <pro-input
        title="邮箱"
        tooltip="邮箱"
        path="email"
      />

      <pro-input
        title="手机号"
        tooltip="手机号"
        path="phone"
      />

      <pro-textarea
        title="备注"
        tooltip="备注"
        path="remark"
        :field-props="{ autosize: { minRows: 3, maxRows: 5 } }"
      />

      <n-flex justify="center">
        <n-button @click="router.back()">
          返回
        </n-button>
        <n-button
          attr-type="reset"
          type="warning"
        >
          重置
        </n-button>
        <n-button
          attr-type="submit"
          type="primary"
        >
          提交
        </n-button>
      </n-flex>
    </pro-form>
  </pro-card>
</template>
