import { createOptionsAndMapping } from '@/utils/common'

export const {
  options: statusOptions,
  mapping: statusMapping,
  mapping2: statusToColorMapping,
} = createOptionsAndMapping([
  ['1', '启用', 'success'],
  ['0', '禁用', 'error'],
])
