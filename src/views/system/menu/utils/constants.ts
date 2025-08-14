import { createOptionsAndMapping } from '@/utils/common'

export const {
  options: typeOptions,
  mapping: typeMapping,
  mapping2: typeToColorMapping,
} = createOptionsAndMapping([
  ['0', 'common.status.directory', 'info'],
  ['1', 'common.status.menu', 'primary'],
  ['2', 'common.status.subpage', 'success'],
  ['3', 'common.status.permission', 'warning'],
])

export const {
  options: statusOptions,
  mapping: statusMapping,
  mapping2: statusToColorMapping,
} = createOptionsAndMapping([
  ['1', 'common.often.enable', 'success'],
  ['0', 'common.often.disable', 'error'],
])

export const {
  options: linkModeOptions,
  mapping: linkModeMapping,
} = createOptionsAndMapping([
  ['0', 'common.status.newWindow', 'primary'],
  ['1', 'common.status.iframe', 'error'],
])
