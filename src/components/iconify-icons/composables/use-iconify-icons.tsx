import type { SelectProps, SelectRenderLabel, SelectRenderTag } from 'naive-ui'
import type { UseProRequestOptions } from '@/composables/use-pro-request/types'
import { Icon } from '@iconify/vue'
import { NButton, NTag } from 'naive-ui'
import { computed } from 'vue'
import { useProRequest } from '@/composables/use-pro-request'
import { Api } from '../iconify-icons.api'

export function useIconifyIcons<
  Data extends Array<{ label: string, value: string }>,
  Params extends [string, number],
>(options?: UseProRequestOptions<Data, Params>) {
  const {
    cancel,
    loading,
    data: icons,
    run: queryIcons,
  } = useProRequest(
    async (query: string, limit: number) => {
      const res = await Api.queryIcons(query, limit)
      return res.data.icons.map(icon => ({ label: icon, value: icon }))
    },
    {
      manual: true,
      debounceWait: 300,
      ...(options as any ?? {}),
    },
  )

  const onSearch = (query: string) => {
    if (!query.length) {
      icons.value = []
      cancel()
      return
    }
    queryIcons(query, 50)
  }

  const renderLabel: SelectRenderLabel = (option) => {
    return (
      <div class="flex items-center">
        <NButton
          circle
          size="small"
          bordered={false}
          renderIcon={() => {
            return <Icon icon={option.value as string} />
          }}
        />
        <span>{option.label!}</span>
      </div>
    )
  }

  const renderSingleTag: SelectRenderTag = ({ option }) => {
    return (
      <div class="flex items-center">
        <div>
          <NButton
            circle
            size="small"
            bordered={false}
            renderIcon={() => {
              return <Icon icon={option.value as string} />
            }}
          />
        </div>
        <span>{option.label!}</span>
      </div>
    )
  }

  const renderMultipleSelectTag: SelectRenderTag = ({ option, handleClose }) => {
    return (
      <NTag
        round={true}
        closable={true}
        class="p-[0_6px_0_1px]!"
        onClose={(e) => {
          e.stopPropagation()
          handleClose()
        }}
      >
        {renderSingleTag({ option, handleClose })}
      </NTag>
    )
  }

  const selectProps = computed<SelectProps>(() => {
    return {
      remote: true,
      filterable: true,
      options: icons.value,
      loading: loading.value,
      onSearch,
      renderLabel,
    }
  })

  return {
    loading,
    queryIcons,
    selectProps,
    renderSingleTag,
    renderMultipleSelectTag,
    icons: computed(() => icons.value ?? []),
  }
}
