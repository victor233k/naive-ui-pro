import { createOptionsAndMapping } from '@/utils/common'

export const {
  options: genderOptions,
  mapping: genderMapping,
  mapping2: genderToColorMapping,
} = createOptionsAndMapping([
  ['1', '男', 'success'],
  ['0', '女', 'error'],
  ['-1', '其他', 'default'],
])

export const {
  options: statusOptions,
  mapping: statusMapping,
  mapping2: statusToColorMapping,
} = createOptionsAndMapping([
  ['1', '启用', 'success'],
  ['0', '禁用', 'error'],
])
