import type { SetOptional } from 'type-fest'
import type { genderMapping, statusMapping } from './utils/constants'
import { isNil } from 'lodash-es'
import http from '@/utils/axios'

type GenderEnum = keyof typeof genderMapping
type StatusEnum = keyof typeof statusMapping

export interface User {
  id: string
  email?: string
  phone?: string
  remark?: string
  username: string
  nickname: string
  password: string
  roleIds: string[]
  status: StatusEnum
  gender: GenderEnum
  createTime: string
  updateTime: string
}

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
  gender?: string
  status?: string
  username?: string
  nickname?: string
}

export class Api {
  /**
   * 分页查询用户
   */
  static page(params: ApiUtil.WithPaginationParams<ListSearchParams>) {
    return http.get<ApiUtil.PaginationResponse<User>>('/system/user/page', { params })
  }

  /**
   * 获取用户详情
   */
  static get(id: string) {
    return http.get<User>(`/system/user/${id}`)
  }

  /**
   * 新增或更新用户
   */
  static insertOrUpdate(data: SetOptional<User, 'id'>) {
    return http({
      method: isNil(data.id) ? 'post' : 'put',
      url: '/system/user',
      data,
    })
  }

  /**
   * 删除用户
   */
  static del(id: string) {
    return http.delete(`/system/user/${id}`)
  }

  /**
   * 获取角色列表
   */
  static roleList() {
    return http.get<Role[]>('/system/role/list')
  }
}
