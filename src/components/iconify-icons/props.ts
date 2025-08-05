import type { SelectProps } from 'naive-ui'
import type { BaseFieldProps } from 'pro-naive-ui'
import type { ExtractPublicPropTypes, PropType } from 'vue'
import { proFieldSharedProps } from 'pro-naive-ui'

export const proIconifyIconsProps = {
  ...proFieldSharedProps,
  fieldProps: Object as PropType<BaseFieldProps<SelectProps>>,
} as const

export type ProIconifyIconsProps = ExtractPublicPropTypes<typeof proIconifyIconsProps>
