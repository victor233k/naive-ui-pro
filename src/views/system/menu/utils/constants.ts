import { createOptionsAndMapping } from '@/utils/common'

export const menuTypeEnum = {
  DIRECTORY: '0',
  MENU: '1',
  // BUTTON: '2',
} as const

export const {
  options: typeOptions,
  mapping: typeMapping,
  mapping2: typeToColorMapping,
} = createOptionsAndMapping([
  [menuTypeEnum.DIRECTORY, 'common.status.directory', 'success'],
  [menuTypeEnum.MENU, 'common.status.menu', 'primary'],
  // [menuTypeEnum.BUTTON, 'common.status.button', 'warning'],
])

export const {
  options: linkModeOptions,
  mapping: linkModeMapping,
} = createOptionsAndMapping([
  ['iframe', 'common.status.iframe', 'error'],
  ['newWindow', 'common.status.newWindow', 'primary'],
])
