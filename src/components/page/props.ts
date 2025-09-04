import type { ExtractPublicPropTypes, PropType } from 'vue'
import type { LoadingBinding } from '@/directive/loading/types'

export const proPageProps = {
  /**
   * v-loading 配置
   */
  loading: [Boolean, Object] as PropType<LoadingBinding>,
  /**
   * 底部区域高度
   */
  footerHeight: Number,
} as const

export type ProPageProps = ExtractPublicPropTypes<typeof proPageProps>
