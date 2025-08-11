import type { ProSelectSlots } from 'pro-naive-ui'
import type { ProIconifyIconsProps } from '@/components/iconify-icons'

declare module 'pro-naive-ui' {
  interface ProFieldCustomColumn {
    column: IconifyIconsColumn | IconifyIconsColumn2
  }

  interface IconifyIconsColumn {
    field: 'iconify-icons'
    fieldSlots: ProSelectSlots
    fieldProps: ProIconifyIconsProps['fieldProps']
  }

  interface IconifyIconsColumn2 {
    field: 'iconify-icons2'
    fieldSlots: ProSelectSlots
    fieldProps: ProIconifyIconsProps['fieldProps']
  }
}

export {}
