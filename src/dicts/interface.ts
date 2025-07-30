import type { TagProps } from 'naive-ui'

export interface DictItem {
  label: string
  value: string
  tagType?: TagProps['type']
}

export type Dict = Map<DictItem['value'], DictItem> & {
  items: () => DictItem[]
}
