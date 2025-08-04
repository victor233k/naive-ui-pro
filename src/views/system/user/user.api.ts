import type { SetOptional } from 'type-fest'
import type { genderMapping, statusMapping } from './constants'
import { isNil } from 'lodash-es'
import http from '@/utils/axios'

type GenderEnum = keyof typeof genderMapping
type StatusEnum = keyof typeof statusMapping

interface UserBaseInfo {
  id: string
  createTime?: string
  updateTime?: string
}

export interface User extends UserBaseInfo {
  email?: string
  phone?: string
  remark?: string
  username: string
  nickname: string
  password: string
  roleIds: string[]
  status: StatusEnum
  gender: GenderEnum
}

export interface Role {
  id: string
  name: string
  code: string
  status: string
  remark?: string
  createTime: string
  updateTime: string
}

export interface UserSearchFormParams {
  gender?: string
  status?: string
  username?: string
  nickname?: string
}

export type UserModalFormParams = Omit<User, keyof UserBaseInfo>

export function apiDeleteUsers(payload: string | string[]) {
  return http.delete(`/system/user/${payload}`)
}

export function apiGetUsers(payload: WithTablePaginationParams<UserSearchFormParams>) {
  return http.get<TablePaginationResponse<User>>('/system/user/page', {
    params: payload,
  }).then(res => res.data)
}

export function apiGetRoles() {
  return http.get<Role[]>('/system/role/list')
}

export function apiGetUserDetail(payload: string) {
  return http.get<User>(`/system/user/${payload}`)
}

export function apiInsertOrUpdate(payload: SetOptional<User, 'id'>) {
  return http({
    method: isNil(payload.id) ? 'post' : 'put',
    url: '/system/user',
    data: payload,
  })
}
