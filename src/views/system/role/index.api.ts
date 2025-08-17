import type { SetOptional } from 'type-fest'
import type { statusMapping } from './utils/constants'
import { isNil } from 'lodash-es'
import http from '@/utils/axios'

type StatusEnum = keyof typeof statusMapping

export interface Role {
  id: string
  name: string
  code: string
  status: StatusEnum
  remark?: string
  createTime: string
  updateTime: string
}

export interface ListSearchParams {
  name?: string
  code?: string
  status?: string
}

export class Api {
  /**
   * 分页查询角色
   */
  static page(params: ApiUtil.WithPaginationParams<ListSearchParams>) {
    return http.get<ApiUtil.PaginationResponse<Role>>('/system/role/page', { params })
  }

  /**
   * 获取角色详情
   */
  static get(id: string) {
    return http.get<Role>(`/system/role/${id}`)
  }

  /**
   * 新增或修改角色
   */
  static insertOrUpdate(data: SetOptional<Role, 'id'>) {
    return http({
      method: isNil(data.id) ? 'post' : 'put',
      url: '/system/role',
      data,
    })
  }

  /**
   * 删除角色
   */
  static del(id: string) {
    return http.delete(`/system/role/${id}`)
  }
}
