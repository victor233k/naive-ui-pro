import type { SetOptional } from 'type-fest'
import type { genderMapping, statusMapping } from './utils/constants'
import { isNil } from 'lodash-es'
import http from '@/utils/axios'

type GenderEnum = keyof typeof genderMapping
type StatusEnum = keyof typeof statusMapping

export class UserApi {
  static page(params: UserApi.page.RequestData) {
    return http.get<UserApi.page.ResponseData>('/system/user/page', { params })
  }

  static list(params: UserApi.list.RequestData = {}) {
    return http.get<UserApi.list.ResponseData>('/system/user/list', { params })
  }

  static get(id: string) {
    return http.get<UserApi.Model>(`/system/user/${id}`)
  }

  static insertOrUpdate(data: UserApi.insertOrUpdate.RequestData) {
    return http({
      method: isNil(data.id) ? 'post' : 'put',
      url: '/system/user',
      data,
    })
  }

  static del(id: string | string[]) {
    return http.delete(`/system/user/${id}`)
  }

  static roleList(params: UserApi.roleList.RequestData = {}) {
    return http.get<UserApi.roleList.ResponseData>('/system/role/list', { params })
  }
}

export namespace UserApi {
  export interface Model extends Api.BaseModel {
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

  export namespace page {
    export type RequestData = Api.WithPaginationParams<{
      gender?: string
      status?: string
      username?: string
      nickname?: string
    }>

    export type ResponseData = Api.ResponseFormat.Page<Model>
  }

  export namespace list {
    export type RequestData = Api.WithoutPaginationParams<page.RequestData>

    export type ResponseData = Api.ResponseFormat.Base<Model[]>
  }

  export namespace get {
    export type ResponseData = Api.ResponseFormat.Base<Model>
  }

  export namespace insertOrUpdate {
    export type RequestData = SetOptional<Model, keyof Api.BaseModel>
  }

  interface RoleModel extends Api.BaseModel {
    name: string
    code: string
    status: StatusEnum
    remark?: string
  }

  export namespace roleList {
    export interface RequestData {
      name?: string
      code?: string
      status?: string
    }

    export type ResponseData = Api.ResponseFormat.Base<RoleModel[]>
  }
}
