import { createDict } from './utils'

export const SysEnableDisable = {
  Enable: '1',
  Disable: '0',
} as const

export const SysEnableDisableDict = createDict([
  {
    label: '启用',
    value: SysEnableDisable.Enable,
    tagType: 'success',
  },
  {
    label: '禁用',
    value: SysEnableDisable.Disable,
    tagType: 'error',
  },
])
