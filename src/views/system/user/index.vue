<script setup lang="tsx">
import type { ProDataTableColumns, ProSearchFormColumns } from 'pro-naive-ui'
import type { SetOptional } from 'type-fest'
import type { ListSearchParams, User } from './index.api'
import { Icon } from '@iconify/vue'
import { createProModalForm, createProSearchForm, renderProDateText, renderProTags } from 'pro-naive-ui'
import { computed } from 'vue'
import { useProNDataTable } from '@/composables/use-pro-n-data-table'
import { useProRequest } from '@/composables/use-pro-request'
import { $t } from '@/locales/locales'
import { translateOptions } from '@/utils/common'
import UserModalForm from './components/user-modal-form.vue'
import { Api } from './index.api'
import {
  genderMapping,
  genderOptions,
  genderToColorMapping,
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
    const res = await Api.page({ pageSize, page: current, ...values })
    return res.data
  },
  {
    form: searchForm,
  },
)

const modalForm = createProModalForm<SetOptional<User, 'id'>>({
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

const { run: runDeleteUsers } = useProRequest(Api.del, {
  manual: true,
  successTip: 'common.often.deleteSuccess',
  onSuccess() {
    onChange({ page: 1 })
  },
})

const { run: handleEditUser } = useProRequest(Api.get, {
  manual: true,
  onSuccess: ({ data: user }) => {
    modalForm.show.value = true
    modalForm.values.value = user
  },
})

const searchColumns = computed<ProSearchFormColumns<ListSearchParams>>(() => {
  return [
    {
      title: $t('pages.system.user.username'),
      path: 'username',
    },
    {
      title: $t('pages.system.user.nickname'),
      path: 'nickname',
    },
    {
      title: $t('pages.system.user.gender'),
      path: 'gender',
      field: 'select',
      fieldProps: () => {
        return {
          options: translateOptions(genderOptions),
        }
      },
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

const tableColumns = computed<ProDataTableColumns<User>>(() => {
  return [
    {
      title: $t('common.often.index'),
      type: 'index',
    },
    {
      title: $t('pages.system.user.username'),
      path: 'username',
      width: 120,
    },
    {
      title: $t('pages.system.user.nicknameShort'),
      path: 'nickname',
      width: 100,
    },
    {
      title: $t('pages.system.user.gender'),
      width: 100,
      render: (row) => {
        return renderProTags({
          content: $t(genderMapping[row.gender]),
          type: genderToColorMapping[row.gender],
        })
      },
    },
    {
      title: $t('pages.system.user.email'),
      path: 'email',
      width: 220,
    },
    {
      title: $t('pages.system.user.phone'),
      path: 'phone',
      width: 140,
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
              onClick={() => handleEditUser(row.id)}
            >
              {$t('common.often.edit')}
            </n-button>
            <n-popconfirm onPositiveClick={() => runDeleteUsers(row.id)}>
              {{
                default: () => (
                  <span>
                    {$t('common.often.deleteConfirm')}
                    <span class="c-red-500 font-bold">{row.nickname}</span>
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
      :title="$t('pages.system.user.title')"
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
            {{ $t('common.often.add') }}
          </n-button>
        </n-flex>
      </template>
    </pro-data-table>
    <pro-modal-form
      :form="modalForm"
      :loading="insertOrUpdateLoading"
      :title="`${modalForm.values.value.id ? $t('pages.system.user.editUser') : $t('pages.system.user.addUser')}`"
    >
      <user-modal-form />
    </pro-modal-form>
  </n-flex>
</template>
