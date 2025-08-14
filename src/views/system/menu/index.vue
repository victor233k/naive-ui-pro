<script setup lang="tsx">
import type { FormRules } from 'naive-ui'
import type { ProDataTableColumns, ProSearchFormColumns } from 'pro-naive-ui'
import { Icon } from '@iconify/vue'
import { orderBy } from 'lodash-es'
import {
  createProModalForm,
  createProSearchForm,
  renderProDateText,
  renderProTags,
} from 'pro-naive-ui'
import { computed } from 'vue'
import { useProNDataTable } from '@/composables/use-pro-n-data-table'
import { useProRequest } from '@/composables/use-pro-request'
import { $t } from '@/locales/locales'
import { translateOptions } from '@/utils/common'
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

const searchForm = createProSearchForm()

const { loading: insertOrUpdateLoading, runAsync: runAsyncInsertOrUpdate }
  = useProRequest(Api.insertOrUpdate, {
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
          : new Error($t('pages.system.menu.requiredWhenNoLink'))
      },
    },
  ],
}

const { run: runDeleteMenus } = useProRequest(Api.del, {
  manual: true,
  successTip: 'common.often.deleteSuccess',
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

const searchColumns = computed<ProSearchFormColumns<Api.list.RequestData>>(() => {
  return [
    {
      title: $t('pages.system.menu.menuTitle'),
      path: 'title',
    },
    {
      title: $t('pages.system.menu.menuType'),
      path: 'type',
      field: 'select',
      fieldProps: () => {
        return {
          options: translateOptions(typeOptions),
        }
      },
    },
    {
      title: $t('pages.system.menu.routeName'),
      path: 'code',
    },
    {
      title: $t('common.often.status'),
      path: 'status',
      field: 'select',
      fieldProps: () => {
        return {
          options: translateOptions(statusOptions),
        }
      },
    },
  ]
})

const tableColumns = computed<ProDataTableColumns<Api.Model>>(() => {
  return [
    {
      title: $t('pages.system.menu.menuTitle'),
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
      title: $t('pages.system.menu.menuType'),
      path: 'type',
      width: 100,
      render: (row) => {
        return renderProTags({
          content: $t(typeMapping[row.type]),
          type: typeToColorMapping[row.type],
        })
      },
    },
    {
      title: $t('pages.system.menu.menuCode'),
      path: 'code',
      width: 150,
    },
    {
      title: $t('pages.system.menu.routePath'),
      path: 'routePath',
      width: 150,
    },
    {
      title: $t('pages.system.menu.routeFile'),
      path: 'routeFile',
      width: 150,
    },
    {
      title: $t('pages.system.menu.sort'),
      path: 'sort',
      width: 120,
    },
    {
      title: $t('common.often.status'),
      width: 100,
      render: (row) => {
        return renderProTags({
          content: $t(statusMapping[row.status]),
          type: statusToColorMapping[row.status],
        })
      },
    },
    {
      title: $t('common.often.remark'),
      path: 'remark',
      ellipsis: {
        tooltip: true,
      },
    },
    {
      title: $t('common.often.updateTime'),
      width: 220,
      render: row => renderProDateText(row.updateTime),
    },
    {
      title: $t('common.often.operation'),
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
              {$t('common.often.add')}
            </n-button>
            <n-button
              type="primary"
              size="small"
              text={true}
              onClick={() => handleEditMenu(row.id)}
            >
              {$t('common.often.edit')}
            </n-button>
            <n-popconfirm onPositiveClick={() => runDeleteMenus(row.id)}>
              {{
                default: () => (
                  <span>
                    {$t('common.often.deleteConfirm')}
                    <span class="c-red-500 font-bold">{row.title}</span>
                    {$t('common.often.deleteQuestion')}
                  </span>
                ),
                trigger: () => {
                  return (
                    <n-button
                      type="error"
                      size="small"
                      text={true}
                    >
                      {$t('common.often.delete')}
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
})
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
      :title="$t('pages.system.menu.title')"
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
            {{ $t('common.often.add') }}
          </n-button>
        </n-flex>
      </template>
    </pro-data-table>
    <pro-modal-form
      :form="modalForm"
      :loading="insertOrUpdateLoading"
      :title="`${modalForm.values.value.id ? $t('pages.system.menu.editMenu') : $t('pages.system.menu.addMenu')}`"
      :rules
    >
      <menu-modal-form :values="modalForm.values.value" />
    </pro-modal-form>
  </n-flex>
</template>
