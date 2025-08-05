<script setup lang="tsx">
import type { ProDataTableColumns, ProSearchFormColumns } from 'pro-naive-ui'
import type { User, UserModalFormParams, UserSearchFormParams } from './user.api'
import { Icon } from '@iconify/vue'
import { createProModalForm, createProSearchForm, renderProDateText, renderProTags } from 'pro-naive-ui'
import { useProNDataTable } from '@/composables/use-pro-n-data-table'
import { useProRequest } from '@/composables/use-pro-request'
import { genderMapping, genderOptions, genderToColorMapping, statusMapping, statusOptions, statusToColorMapping } from './constants'
import UserModalForm from './user-modal-form.vue'
import { apiDeleteUsers, apiGetUserDetail, apiGetUsers, apiInsertOrUpdate } from './user.api'

const searchForm = createProSearchForm()

const {
  loading: insertOrUpdateLoading,
  runAsync: runAsyncInsertOrUpdate,
} = useProRequest(apiInsertOrUpdate, {
  manual: true,
  successTip: true,
})

const {
  search: { proSearchFormProps },
  table: { tableProps, onChange },
} = useProNDataTable(({ current, pageSize }, values) => {
  return apiGetUsers({ pageSize, page: current, ...values })
}, {
  form: searchForm,
})

const modalForm = createProModalForm({
  onSubmit: (values) => {
    runAsyncInsertOrUpdate({
      ...values as UserModalFormParams,
      id: modalForm.values.value.id,
    }).then(() => {
      modalForm.show.value = false
      onChange({ page: 1 })
    })
  },
})

const {
  run: runDeleteUsers,
} = useProRequest(apiDeleteUsers, {
  manual: true,
  successTip: '删除成功',
  onSuccess() {
    onChange({ page: 1 })
  },
})

const {
  run: handleEditUser,
} = useProRequest(apiGetUserDetail, {
  manual: true,
  onSuccess: ({ data: user }) => {
    modalForm.show.value = true
    modalForm.values.value = user
  },
})

const searchColumns: ProSearchFormColumns<UserSearchFormParams> = [
  {
    title: '用户名',
    path: 'username',
  },
  {
    title: '用户昵称',
    path: 'nickname',
  },
  {
    title: '性别',
    path: 'gender',
    field: 'select',
    fieldProps: {
      options: genderOptions,
    },
  },
  {
    title: '状态',
    path: 'status',
    field: 'select',
    fieldProps: {
      options: statusOptions,
    },
  },
]

const tableColumns: ProDataTableColumns<User> = [
  {
    title: '序号',
    type: 'index',
  },
  {
    title: '用户名',
    path: 'username',
    width: 120,
  },
  {
    title: '昵称',
    path: 'nickname',
    width: 100,
  },
  {
    title: '性别',
    width: 100,
    render: (row) => {
      return renderProTags({
        content: genderMapping[row.gender],
        type: genderToColorMapping[row.gender],
      })
    },
  },
  {
    title: '邮箱',
    path: 'email',
    width: 220,
  },
  {
    title: '手机号',
    path: 'phone',
    width: 140,
  },
  {
    title: '状态',
    width: 100,
    render: (row) => {
      return renderProTags({
        content: statusMapping[row.status],
        type: statusToColorMapping[row.status],
      })
    },
  },
  {
    title: '备注',
    path: 'remark',
    width: 230,
  },
  {
    title: '更新时间',
    width: 220,
    render: row => renderProDateText(row.updateTime),
  },
  {
    title: '操作',
    width: 120,
    render: (row) => {
      return (
        <n-flex>
          <n-button
            type="primary"
            size="small"
            text={true}
            onClick={() => handleEditUser(row.id)}
          >
            编辑
          </n-button>
          <n-popconfirm
            onPositiveClick={() => runDeleteUsers(row.id)}
          >
            {{
              default: () => (
                <span>
                  确定删除
                  <span class="c-red-500 font-bold">{row.nickname}</span>
                  吗？
                </span>
              ),
              trigger: () => {
                return (
                  <n-button
                    type="error"
                    size="small"
                    text={true}
                  >
                    删除
                  </n-button>
                )
              },
            }}
          </n-popconfirm>
        </n-flex>
      )
    },
  },
]
</script>

<template>
  <n-flex
    class="h-full"
    vertical
    size="large"
  >
    <pro-card content-class="pb-0!">
      <pro-search-form
        :form="searchForm"
        :columns="searchColumns"
        v-bind="proSearchFormProps"
      />
    </pro-card>
    <pro-data-table
      title="用户列表"
      row-key="id"
      flex-height
      :scroll-x="1440"
      :columns="tableColumns"
      v-bind="tableProps"
    >
      <template #toolbar>
        <n-flex>
          <n-button
            type="primary"
            ghost
            @click="modalForm.show.value = true"
          >
            <template #icon>
              <n-icon>
                <icon icon="ant-design:plus-outlined" />
              </n-icon>
            </template>
            新增
          </n-button>
        </n-flex>
      </template>
    </pro-data-table>
    <pro-modal-form
      :form="modalForm"
      :loading="insertOrUpdateLoading"
      :title="`${modalForm.values.value.id ? `编辑` : '新增'}用户`"
    >
      <user-modal-form />
    </pro-modal-form>
  </n-flex>
</template>
