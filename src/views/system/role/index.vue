<script setup lang="tsx">
import type { ProDataTableColumns, ProSearchFormColumns } from 'pro-naive-ui'
import { Icon } from '@iconify/vue'
import { format } from 'date-fns'
import { useMessage } from 'naive-ui'
import { createProSearchForm, useNDataTable } from 'pro-naive-ui'
import { useRouter } from 'vue-router'
import { RoleApi } from '@/api/system/role'
import { SysEnableDisableDict } from '@/dicts/sys-enable-disable'
import { renderProTagByDictValue } from '@/dicts/utils'
import { useHandle } from '@/hooks/use-handle'
import { shallowRef } from 'vue'

const router = useRouter()
const message = useMessage()

const searchForm = createProSearchForm()
const searchColumns: ProSearchFormColumns<RoleApi.page.RequestData> = [
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
    RoleApi.page({
      ...searchForm.values.value,
      page: current,
      pageSize,
    }).then((res) => res.data),
  {
    form: searchForm,
    onError(e) {
      message.error(e.message)
    },
  },
)

const checkedRowKeys = shallowRef([])
const { run: delData,  } = useHandle(RoleApi.del, {
  delete: true,
  onSuccess() {
    checkedRowKeys.value = []
    refresh()
  },
})

const columns: ProDataTableColumns<RoleApi.Model> = [
  {
    type: 'selection',
  },
  {
    title: '行号',
    type: 'index',
  },
  {
    title: '角色名',
    render: (row) => row.name,
  },
  {
    title: '角色编码',
    render: (row) => row.code,
  },
  {
    title: '状态',
    render: (row) => renderProTagByDictValue(row.status, SysEnableDisableDict),
  },
  {
    title: '备注',
    render: (row) => row.remark,
  },
  {
    title: '更新时间',
    render: (row) =>
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
              router.push({ name: 'RoleDetail', params: { id: row.id } })
            }
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
      row-key="id"
      flex-height
      :columns
      v-model:checked-row-keys="checkedRowKeys"
      v-bind="tableProps"
    >
      <template #extra>
        <n-flex>
          <n-button
            type="primary"
            ghost
            @click="router.push({ name: 'RoleDetail' })"
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
