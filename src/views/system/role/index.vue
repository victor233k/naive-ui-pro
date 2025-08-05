<script setup lang="tsx">
import type { ProDataTableColumns, ProSearchFormColumns } from 'pro-naive-ui'
import type { Role, RoleModalFormParams, RoleSearchFormParams } from './role.api'
import { Icon } from '@iconify/vue'
import { createProModalForm, createProSearchForm, renderProDateText, renderProTags } from 'pro-naive-ui'
import { useProNDataTable } from '@/composables/use-pro-n-data-table'
import { useProRequest } from '@/composables/use-pro-request'
import { statusMapping, statusOptions, statusToColorMapping } from './constants'
import RoleModalForm from './role-modal-form.vue'
import { apiDeleteRoles, apiGetRoleDetail, apiGetRoles, apiInsertOrUpdate } from './role.api'

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
  return apiGetRoles({ pageSize, page: current, ...values })
}, {
  form: searchForm,
})

const modalForm = createProModalForm({
  onSubmit: (values) => {
    runAsyncInsertOrUpdate({
      ...values as RoleModalFormParams,
      id: modalForm.values.value.id,
    }).then(() => {
      modalForm.show.value = false
      onChange({ page: 1 })
    })
  },
})

const {
  run: runDeleteRoles,
} = useProRequest(apiDeleteRoles, {
  manual: true,
  successTip: '删除成功',
  onSuccess() {
    onChange({ page: 1 })
  },
})

const {
  run: handleEditRole,
} = useProRequest(apiGetRoleDetail, {
  manual: true,
  onSuccess: ({ data: role }) => {
    modalForm.show.value = true
    modalForm.values.value = role
  },
})

const searchColumns: ProSearchFormColumns<RoleSearchFormParams> = [
  {
    title: '角色名',
    path: 'name',
  },
  {
    title: '角色编码',
    path: 'code',
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

const tableColumns: ProDataTableColumns<Role> = [
  {
    title: '序号',
    type: 'index',
  },
  {
    title: '角色名',
    path: 'name',
    width: 120,
  },
  {
    title: '角色编码',
    path: 'code',
    width: 120,
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
    ellipsis: {
      tooltip: true,
    },
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
            onClick={() => handleEditRole(row.id)}
          >
            编辑
          </n-button>
          <n-popconfirm
            onPositiveClick={() => runDeleteRoles(row.id)}
          >
            {{
              default: () => (
                <span>
                  确定删除
                  <span class="c-red-500 font-bold">{row.name}</span>
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
      title="角色列表"
      row-key="id"
      flex-height
      :scroll-x="970"
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
      :title="`${modalForm.values.value.id ? `编辑` : '新增'}角色`"
    >
      <role-modal-form />
    </pro-modal-form>
  </n-flex>
</template>
