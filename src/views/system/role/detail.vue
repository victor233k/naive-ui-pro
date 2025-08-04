<script setup lang="ts">
import type { FormRules } from 'naive-ui'
import { useMessage } from 'naive-ui'
import { createProForm, useRequest } from 'pro-naive-ui'
import { useRoute, useRouter } from 'vue-router'
import { RoleApi } from '@/api/system/role'
import {
  SysEnableDisable,
  SysEnableDisableDict,
} from '@/dicts/sys-enable-disable'

const router = useRouter()
const route = useRoute()
const message = useMessage()

const { loading: submitting, run: submit } = useRequest(
  RoleApi.insertOrUpdate,
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

const form = createProForm<RoleApi.insertOrUpdate.RequestData>({
  initialValues: {
    name: '',
    code: '',
    status: SysEnableDisable.Enable,
  },
  onSubmit: () => {
    submit(form.values.value)
  },
})

const rules: FormRules = {
  name: [{ required: true }],
  code: [{ required: true }],
  status: [{ required: true }],
}

const isUpdate = !!route.params.id
const { loading } = useRequest(() => RoleApi.get(route.params.id as string), {
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
        title="角色名"
        tooltip="角色名"
        path="name"
      />

      <pro-input
        title="角色编码"
        tooltip="角色编码"
        path="code"
      />

      <pro-radio-group
        title="状态"
        path="status"
        :field-props="{ options: SysEnableDisableDict.items() }"
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
