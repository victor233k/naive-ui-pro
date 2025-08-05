import type { SetOptional } from 'type-fest'
import type { statusMapping } from './constants'
import { isNil } from 'lodash-es'
import http from '@/utils/axios'

type StatusEnum = keyof typeof statusMapping

interface RoleBaseInfo {
  id: string
  createTime?: string
  updateTime?: string
}

export interface Role extends RoleBaseInfo {
  name: string
  code: string
  status: StatusEnum
  remark?: string
}

export interface RoleSearchFormParams {
  name?: string
  code?: string
  status?: string
}

export type RoleModalFormParams = Omit<Role, keyof RoleBaseInfo>

export function apiDeleteRoles(payload: string | string[]) {
  return http.delete(`/system/role/${payload}`)
}

export function apiGetRoles(payload: WithTablePaginationParams<RoleSearchFormParams>) {
  return http.get<TablePaginationResponse<Role>>('/system/role/page', {
    params: payload,
  }).then(res => res.data)
}

export function apiGetRoleDetail(payload: string) {
  return http.get<Role>(`/system/role/${payload}`)
}

export function apiInsertOrUpdate(payload: SetOptional<Role, 'id'>) {
  return http({
    method: isNil(payload.id) ? 'post' : 'put',
    url: '/system/role',
    data: payload,
  })
}
