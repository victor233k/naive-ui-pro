import type { SelectProps } from 'naive-ui'
import { proSelectProps, type BaseFieldProps } from 'pro-naive-ui'
import type { ExtractPublicPropTypes, PropType } from 'vue'

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
