import type { ProIconifyIconsProps, ProIconifyIconsSlots } from '@/components/iconify-icons'

declare module 'pro-naive-ui' {
  interface ProFieldCustomColumn {
    column: IconifyIconsColumn
  }

  interface IconifyIconsColumn {
    field: 'iconify-icons'
    fieldSlots: ProIconifyIconsSlots
    fieldProps: ProIconifyIconsProps['fieldProps']
  }
}

export {}
