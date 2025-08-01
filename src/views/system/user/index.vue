<script setup lang="tsx">
import type { ProDataTableColumns, ProSearchFormColumns } from 'pro-naive-ui'
import { Icon } from '@iconify/vue'
import { format } from 'date-fns'
import { useMessage, useModal } from 'naive-ui'
import { createProSearchForm, useNDataTable, useRequest } from 'pro-naive-ui'
import { shallowRef } from 'vue'
import { useRouter } from 'vue-router'
import { UserApi } from '@/api/system/user'
import { SysEnableDisableDict } from '@/dicts/sys-enable-disable'
import { SysUserGenderDict } from '@/dicts/sys-user-gender'
import { renderProTagByDictValue } from '@/dicts/utils'

const router = useRouter()
const message = useMessage()
const modal = useModal()

const searchForm = createProSearchForm()
const searchColumns: ProSearchFormColumns<UserApi.page.RequestData> = [
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
    fieldProps() {
      return {
        options: SysUserGenderDict.items(),
      }
    },
  },
  {
    title: '状态',
    path: 'status',
    field: 'select',
    fieldProps() {
      return {
        options: SysEnableDisableDict.items(),
      }
    },
  },
]

const {
  table: { tableProps },
  search: { proSearchFormProps },
  refresh,
} = useNDataTable(
  ({ current, pageSize }) =>
    UserApi.page({
      ...searchForm.values.value,
      page: current,
      pageSize,
    }).then(res => res.data),
  {
    form: searchForm,
    onError(e) {
      message.error(e.message)
    },
  },
)

const checkedRowKeys = shallowRef([])
const { run: del } = useRequest(UserApi.del, {
  onSuccess() {
    checkedRowKeys.value = []
    refresh()
    message.success('删除成功')
  },
  onError(e) {
    message.error(e.message)
  },
})
const delData: typeof del = (...args) => {
  modal.create({
    preset: 'dialog',
    type: 'warning',
    title: '提示',
    positiveText: '确定',
    negativeText: '取消',
    content: '您确定要删除选中的数据吗？',
    onPositiveClick: () => del(...args),
  })
}

const columns: ProDataTableColumns<UserApi.Model> = [
  {
    type: 'selection',
  },
  {
    title: '行号',
    type: 'index',
  },
  {
    title: '用户名',
    render: row => row.username,
  },
  {
    title: '昵称',
    render: row => row.nickname,
  },
  {
    title: '性别',
    render: row => renderProTagByDictValue(row.gender, SysUserGenderDict),
  },
  {
    title: '邮箱',
    render: row => row.email,
  },
  {
    title: '手机号',
    render: row => row.phone,
  },
  {
    title: '状态',
    render: row => renderProTagByDictValue(row.status, SysEnableDisableDict),
  },
  {
    title: '备注',
    render: row => row.remark,
  },
  {
    title: '更新时间',
    render: row =>
      row.updateTime && format(row.updateTime, 'yyyy-MM-dd HH:mm:ss'),
  },
  {
    title: '操作',
    width: 150,
    render: (row) => {
      return (
        <n-flex>
          <n-button
            type="primary"
            quaternary
            size="small"
            onClick={() =>
              router.push({ name: 'UserDetail', params: { id: row.id } })}
          >
            {{
              icon: () => (
                <n-icon>
                  <Icon icon="ant-design:edit-outlined" />
                </n-icon>
              ),
            }}
          </n-button>
          <n-button
            type="error"
            quaternary
            size="small"
            onClick={() => delData(row.id)}
          >
            {{
              icon: () => (
                <n-icon>
                  <Icon icon="ant-design:delete-outlined" />
                </n-icon>
              ),
            }}
          </n-button>
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
    <pro-card title="筛选条件">
      <pro-search-form
        :form="searchForm"
        :columns="searchColumns"
        v-bind="proSearchFormProps"
      />
    </pro-card>

    <pro-data-table
      v-model:checked-row-keys="checkedRowKeys"
      row-key="id"
      flex-height
      :columns
      v-bind="tableProps"
    >
      <template #extra>
        <n-flex>
          <n-button
            type="primary"
            ghost
            @click="router.push({ name: 'UserDetail' })"
          >
            <template #icon>
              <n-icon>
                <icon icon="ant-design:plus-outlined" />
              </n-icon>
            </template>
            新增
          </n-button>
          <n-button
            type="error"
            ghost
            :disabled="checkedRowKeys.length === 0"
            @click="delData(checkedRowKeys)"
          >
            <template #icon>
              <n-icon>
                <icon icon="ant-design:delete-outlined" />
              </n-icon>
            </template>
            删除
          </n-button>

          <n-button
            ghost
            @click="refresh"
          >
            <template #icon>
              <n-icon>
                <icon icon="ant-design:reload-outlined" />
              </n-icon>
            </template>
            刷新
          </n-button>
        </n-flex>
      </template>
    </pro-data-table>
  </n-flex>
</template>
