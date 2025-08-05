import type { SlotsType } from 'vue'
import type { ProIconifyIconsSlots } from './slots'
import { ProField, useMergePlaceholder, useOverrideProps } from 'pro-naive-ui'
import { defineComponent } from 'vue'
import IconifyIcons from './components/iconify-icons'
import { proIconifyIconsProps } from './props'

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
     * 默认使用 pro-select 的 placeholder
     */
    const mergedPlaceholder = useMergePlaceholder(
      'ProSelect',
      props,
    )
    return {
      overridedProps,
      mergedPlaceholder,
    }
  },
  render() {
    return (
      <ProField
        {...this.overridedProps}
        placeholder={this.mergedPlaceholder}
      >
        {{
          ...this.$slots,
          input: ({ inputProps }: any) => {
            return <IconifyIcons {...inputProps} v-slots={this.$slots} />
          },
        }}
      </ProField>
    )
  },
})
