import { createOptionsAndMapping } from '@/utils/common'

export const {
  options: typeOptions,
  mapping: typeMapping,
  mapping2: typeToColorMapping,
} = createOptionsAndMapping([
  ['0', '目录', 'info'],
  ['1', '菜单', 'primary'],
  ['2', '子页面', 'success'],
  ['3', '权限', 'warning'],
])

export const {
  options: statusOptions,
  mapping: statusMapping,
  mapping2: statusToColorMapping,
} = createOptionsAndMapping([
  ['1', '启用', 'success'],
  ['0', '禁用', 'error'],
])

export const {
  options: linkModeOptions,
  mapping: linkModeMapping,
  mapping2: linkModeMapping2,
} = createOptionsAndMapping([
  ['0', '新窗口', 'primary'],
  ['1', 'iframe', 'error'],
])
