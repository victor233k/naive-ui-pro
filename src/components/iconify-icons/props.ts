import type { SelectProps } from 'naive-ui'
import type { BaseFieldProps } from 'pro-naive-ui'
import type { Merge } from 'type-fest'
import type { ExtractPublicPropTypes, PropType } from 'vue'
import { proSelectProps } from 'pro-naive-ui'

export type ProIconifyIconsFieldProps = Merge<
  BaseFieldProps<
    Omit<
      SelectProps,
      | 'remote'
      | 'options'
      | 'loading'
      | 'onSearch'
      | 'renderTag'
      | 'filterable'
      | 'renderLabel'
    >
  >,
  {
    limit?: number
  }
>

export const proIconifyIconsProps = {
  ...proSelectProps,
  fieldProps: {
    type: Object as PropType<ProIconifyIconsFieldProps>,
    default: () => ({}),
  },
} as const

export type ProIconifyIconsProps = ExtractPublicPropTypes<typeof proIconifyIconsProps>
