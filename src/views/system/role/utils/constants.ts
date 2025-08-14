import { createOptionsAndMapping } from '@/utils/common'

export const {
  options: statusOptions,
  mapping: statusMapping,
  mapping2: statusToColorMapping,
} = createOptionsAndMapping([
  ['1', 'common.often.enable', 'success'],
  ['0', 'common.often.disable', 'error'],
])
