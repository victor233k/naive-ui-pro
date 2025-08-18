<script setup lang="tsx">
import type { ProDataTableColumns, ProSearchFormColumns } from 'pro-naive-ui'
import type { SetOptional } from 'type-fest'
import type { ListSearchParams, Role } from './index.api'
import { Icon } from '@iconify/vue'
import { createProModalForm, createProSearchForm, renderProDateText, renderProTags } from 'pro-naive-ui'
import { computed } from 'vue'
import { useProNDataTable } from '@/composables/use-pro-n-data-table'
import { useProRequest } from '@/composables/use-pro-request'
import { $t } from '@/locales/locales'
import { translateOptions } from '@/utils/common'
import RoleModalForm from './components/role-modal-form.vue'
import { Api } from './index.api'
import {
  statusMapping,
  statusOptions,
  statusToColorMapping,
} from './utils/constants'

const searchForm = createProSearchForm()

const {
  loading: insertOrUpdateLoading,
  runAsync: runAsyncInsertOrUpdate,
} = useProRequest(Api.insertOrUpdate, {
  manual: true,
  successTip: true,
})

const {
  search: { proSearchFormProps },
  table: { tableProps, onChange },
} = useProNDataTable(
  async ({ current, pageSize }, values) => {
    const { data } = await Api.page({ pageSize, page: current, ...values })
    return data
  },
  {
    form: searchForm,
  },
)

const modalForm = createProModalForm<SetOptional<Role, 'id'>>({
  onSubmit: (values) => {
    runAsyncInsertOrUpdate({
      ...values,
      id: modalForm.values.value.id,
    }).then(() => {
      modalForm.show.value = false
      onChange({ page: 1 })
    })
  },
})

const { run: runDeleteRoles } = useProRequest(Api.del, {
  manual: true,
  successTip: 'common.often.deleteSuccess',
  onSuccess() {
    onChange({ page: 1 })
  },
})

const { run: handleEditRole } = useProRequest(Api.get, {
  manual: true,
  onSuccess: ({ data: role }) => {
    modalForm.show.value = true
    modalForm.values.value = role
  },
})

const searchColumns = computed<ProSearchFormColumns<ListSearchParams>>(() => {
  return [
    {
      title: $t('pages.system.role.roleName'),
      path: 'name',
    },
    {
      title: $t('pages.system.role.roleCode'),
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

const tableColumns = computed<ProDataTableColumns<Role>>(() => {
  return [
    {
      title: $t('common.often.index'),
      type: 'index',
    },
    {
      title: $t('pages.system.role.roleName'),
      path: 'name',
      width: 120,
    },
    {
      title: $t('pages.system.role.roleCode'),
      path: 'code',
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
      width: 230,
    },
    {
      title: $t('common.often.updateTime'),
      width: 220,
      render: row => renderProDateText(row.updateTime),
    },
    {
      title: $t('common.often.operation'),
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
              {$t('common.often.edit')}
            </n-button>
            <n-popconfirm onPositiveClick={() => runDeleteRoles(row.id)}>
              {{
                default: () => (
                  <span>
                    {$t('common.often.deleteConfirm')}
                    <span class="c-red-500 font-bold">{row.name}</span>
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
      :title="$t('pages.system.role.title')"
      row-key="id"
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
      :title="`${modalForm.values.value.id ? $t('pages.system.role.editRole') : $t('pages.system.role.addRole')}`"
    >
      <role-modal-form />
    </pro-modal-form>
  </n-flex>
</template>
