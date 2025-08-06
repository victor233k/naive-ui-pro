<script setup lang="tsx">
import type { ProDataTableColumns, ProSearchFormColumns } from 'pro-naive-ui'
import { Icon } from '@iconify/vue'
import {
  createProModalForm,
  createProSearchForm,
  renderProDateText,
  renderProTags,
} from 'pro-naive-ui'
import { useProNDataTable } from '@/composables/use-pro-n-data-table'
import { useProRequest } from '@/composables/use-pro-request'
import MenuModalForm from './components/menu-modal-form.vue'
import { Api } from './index.api'
import { buildTree } from './utils'
import {
  statusMapping,
  statusOptions,
  statusToColorMapping,
  typeMapping,
  typeOptions,
  typeToColorMapping,
} from './utils/constants'
import type { FormRules } from 'naive-ui'
import { orderBy } from 'lodash-es'

const searchForm = createProSearchForm()

const { loading: insertOrUpdateLoading, runAsync: runAsyncInsertOrUpdate } =
  useProRequest(Api.insertOrUpdate, {
    manual: true,
    successTip: true,
  })

const {
  search: { proSearchFormProps },
  table: { tableProps, onChange },
} = useProNDataTable(
  async (_, values) => {
    const { data } = await Api.list(values)
    return { list: buildTree(orderBy(data, ['sort'], ['asc'])), total: data.length }
  },
  {
    form: searchForm,
  },
)

tableProps.value.pagination = false

const modalForm = createProModalForm<Api.insertOrUpdate.RequestData>({
  initialValues: {
    type: '0',
    title: '',
    code: '',
    status: '1',
    linkMode: '0',
    sort: 1,
    keepAlive: true,
  },
  onSubmit: (
    values: Omit<Api.insertOrUpdate.RequestData, ApiUtil.CommonModelAttrs>,
  ) => {
    const data = {
      ...values,
      id: modalForm.values.value.id,
    }

    switch (data.type) {
      case '0': {
        data.link = ''
        data.linkMode = '0'
        data.routeFile = ''
        data.keepAlive = true
        break
      }

      case '2': {
        data.link = ''
        data.linkMode = '0'
        break
      }

      case '3': {
        data.icon = ''
        data.link = ''
        data.linkMode = '0'
        data.routeFile = ''
        data.routePath = ''
        data.keepAlive = true
        break
      }
    }

    runAsyncInsertOrUpdate(data).then(() => {
      modalForm.show.value = false
      onChange({ page: 1 })
    })
  },
})

const rules: FormRules = {
  routeFile: [
    {
      validator: () => {
        const value = modalForm.values.value
        return value.routeFile || (value.type === '1' && value.link)
          ? true
          : new Error('未设置外链时该项必填')
      },
    },
  ],
}

const { run: runDeleteMenus } = useProRequest(Api.del, {
  manual: true,
  successTip: '删除成功',
  onSuccess() {
    onChange({ page: 1 })
  },
})

const { run: handleEditMenu } = useProRequest(Api.get, {
  manual: true,
  onSuccess: ({ data: menu }) => {
    modalForm.show.value = true
    modalForm.values.value = menu
  },
})

const searchColumns: ProSearchFormColumns<Api.list.RequestData> = [
  {
    title: '菜单标题',
    path: 'title',
  },
  {
    title: '菜单类型',
    path: 'type',
    field: 'select',
    fieldProps: {
      options: typeOptions,
    },
  },
  {
    title: '路由名称',
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

const tableColumns: ProDataTableColumns<Api.Model> = [
  {
    title: '菜单标题',
    path: 'title',
    width: 180,
    render: (row) => {
      return (
        <n-flex
          inline
          align="center"
        >
          {row.icon && <Icon icon={row.icon}></Icon>}
          <span>{row.title}</span>
        </n-flex>
      )
    },
  },
  {
    title: '菜单类型',
    path: 'type',
    width: 100,
    render: (row) => {
      return renderProTags({
        content: typeMapping[row.type],
        type: typeToColorMapping[row.type],
      })
    },
  },
  {
    title: '菜单编码',
    path: 'code',
    width: 150,
  },
  {
    title: '路由路径',
    path: 'routePath',
    width: 150,
  },
  {
    title: '路由文件',
    path: 'routeFile',
    width: 150,
  },
  {
    title: '排序',
    path: 'sort',
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
  },
  {
    title: '更新时间',
    width: 220,
    render: (row) => renderProDateText(row.updateTime),
  },
  {
    title: '操作',
    width: 150,
    render: (row) => {
      return (
        <n-flex>
          <n-button
            type="primary"
            size="small"
            text={true}
            onClick={() => {
              modalForm.values.value.parentId = row.id
              modalForm.show.value = true
            }}
          >
            新增
          </n-button>
          <n-button
            type="primary"
            size="small"
            text={true}
            onClick={() => handleEditMenu(row.id)}
          >
            编辑
          </n-button>
          <n-popconfirm onPositiveClick={() => runDeleteMenus(row.id)}>
            {{
              default: () => (
                <span>
                  确定删除
                  <span class="c-red-500 font-bold">{row.title}</span>
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
      title="菜单列表"
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
      :title="`${modalForm.values.value.id ? `编辑` : '新增'}菜单`"
      :rules
    >
      <menu-modal-form :values="modalForm.values.value" />
    </pro-modal-form>
  </n-flex>
</template>
