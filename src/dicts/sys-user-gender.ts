import { createDict } from './utils'

export const SysUserGender = {
  Male: '0',
  Female: '1',
  Other: '-1',
} as const

export const SysUserGenderDict = createDict([
  {
    label: '男',
    value: SysUserGender.Male,
    tagType: 'primary',
  },
  {
    label: '女',
    value: SysUserGender.Female,
    tagType: 'error',
  },
  {
    label: '其他',
    value: SysUserGender.Other,
  },
])
