import type { SelectProps } from 'naive-ui'
import type { BaseFieldProps, ProSelectInst, ProSelectSlots } from 'pro-naive-ui'
import type { ExtractPublicPropTypes, PropType } from 'vue'
import { proSelectProps } from 'pro-naive-ui'

export const proIconSelectProps = {
  ...proSelectProps,
  fieldProps: {
    type: Object as PropType<
      BaseFieldProps<
        Omit<
          SelectProps,
          'remote' | 'options' | 'filterable' | 'loading' | 'onSearch'
        >
      > & {
        limit?: number
      }
    >,
    default: () => ({}),
  },
}

export type ProIconSelectProps = ExtractPublicPropTypes<
  typeof proIconSelectProps
>

export type ProIconSelectSlots = ProSelectSlots

export type ProIconSelectInst = ProSelectInst
