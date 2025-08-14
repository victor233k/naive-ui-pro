import { createOptionsAndMapping } from '@/utils/common'

export const {
  options: genderOptions,
  mapping: genderMapping,
  mapping2: genderToColorMapping,
} = createOptionsAndMapping([
  ['1', 'common.status.male', 'success'],
  ['0', 'common.status.female', 'error'],
  ['-1', 'common.status.other', 'default'],
])

export const {
  options: statusOptions,
  mapping: statusMapping,
  mapping2: statusToColorMapping,
} = createOptionsAndMapping([
  ['1', 'common.often.enable', 'success'],
  ['0', 'common.often.disable', 'error'],
])
