import type { SelectProps } from 'naive-ui'
import type { SlotsType, VNodeChild } from 'vue'
import type { ProIconifyIconsSlots } from './slots'
import { pick } from 'lodash-es'
import { NSelect, selectProps } from 'naive-ui'
import { ProField, useFieldUtils, useMergePlaceholder, useOverrideProps } from 'pro-naive-ui'
import { computed, defineComponent, getCurrentInstance, inject, watch } from 'vue'
import { useIconifyIcons } from './composables/use-iconify-icons'
import { proIconifyIconsProps } from './props'

const InternalIconifyIcons = defineComponent({
  name: 'InternalIconifyIcons',
  props: selectProps,
  inheritAttrs: false,
  slots: Object as SlotsType<ProIconifyIconsSlots>,
  setup(props) {
    const {
      icons,
      selectProps,
      queryIcons,
      renderSingleTag,
      renderMultipleSelectTag,
    } = useIconifyIcons()

    const {
      field,
      value,
      empty,
      emptyDom,
      readonly,
    } = useFieldUtils()

    const inst = getCurrentInstance()
    const clearable = inject('pro-form-clearable', props.clearable)

    const mergedSelectProps = computed(() => {
      const inhertprops = inst?.vnode.props ?? {}
      const renderTag = props.multiple ? renderMultipleSelectTag : renderSingleTag
      return {
        renderTag,
        clearable,
        ...selectProps.value,
        ...pick(props, Object.keys(inhertprops)),
      }
    })

    const nSelectProps = computed<SelectProps>(() => {
      return {
        ...props,
        ...mergedSelectProps.value,
        value: props.value ?? null,
      }
    })

    /**
     * 解决手动赋值回显逻辑
     */
    watch(value, (query: string | string[] | undefined) => {
      if (
        !query
        || !query.length
        || field.touching
      ) {
        return
      }
      if (props.multiple) {
        query = query[query.length - 1]
      }
      const index = icons.value.findIndex(icon => icon.value === query)
      if (!~index) {
        queryIcons(query as string, 50)
      }
    }, { flush: 'sync', immediate: true })

    return {
      empty,
      readonly,
      emptyDom,
      nSelectProps,
    }
  },
  render() {
    let dom: VNodeChild
    if (this.readonly) {
      dom = this.empty
        ? this.emptyDom
        : (
            <NSelect
              {...this.$attrs}
              {...this.nSelectProps}
              disabled={true}
              v-slots={this.$slots}
            >
            </NSelect>
          )
    }
    else {
      dom = (
        <NSelect
          {...this.$attrs}
          {...this.nSelectProps}
          v-slots={this.$slots}
        >
        </NSelect>
      )
    }
    return this.$slots.input
      ? this.$slots.input({
          inputDom: dom,
          readonly: this.readonly,
          inputProps: this.nSelectProps,
        })
      : dom
  },
})

const name = 'ProIconifyIcons'
export default defineComponent({
  name,
  props: proIconifyIconsProps,
  slots: Object as SlotsType<ProIconifyIconsSlots>,
  setup(props) {
    /**
     * 允许被 pro-config-provider props 覆盖
     */
    const overridedProps = useOverrideProps(
      name,
      props,
    )

    /**
     * 使用 pro-select 的 placeholder
     */
    const placeholder = useMergePlaceholder(
      'ProSelect',
      props,
    )

    return {
      placeholder,
      overridedProps,
    }
  },
  render() {
    return (
      <ProField
        {...this.overridedProps}
        placeholder={this.placeholder}
      >
        {{
          ...this.$slots,
          input: ({ inputProps }: any) => {
            return <InternalIconifyIcons {...inputProps} v-slots={this.$slots} />
          },
        }}
      </ProField>
    )
  },
})
