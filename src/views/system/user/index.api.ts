import type { SetOptional } from 'type-fest'
import type { genderMapping, statusMapping } from './utils/constants'
import { isNil } from 'lodash-es'
import http from '@/utils/axios'

type GenderEnum = keyof typeof genderMapping
type StatusEnum = keyof typeof statusMapping

export class Api {
  static page(params: Api.page.RequestData) {
    return http.get<Api.page.ResponseData>('/system/user/page', { params })
  }

  static list(params: Api.list.RequestData = {}) {
    return http.get<Api.list.ResponseData>('/system/user/list', { params })
  }

  static get(id: string) {
    return http.get<Api.Model>(`/system/user/${id}`)
  }

  static insertOrUpdate(data: Api.insertOrUpdate.RequestData) {
    return http({
      method: isNil(data.id) ? 'post' : 'put',
      url: '/system/user',
      data,
    })
  }

  static del(id: string | string[]) {
    return http.delete(`/system/user/${id}`)
  }

  static roleList(params: Api.roleList.RequestData = {}) {
    return http.get<Api.roleList.ResponseData>('/system/role/list', { params })
  }
}

export namespace Api {
  export interface Model {
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

  export namespace page {
    export type RequestData = ApiUtil.WithPaginationParams<{
      gender?: string
      status?: string
      username?: string
      nickname?: string
    }>

    export type ResponseData = ApiUtil.ResponseFormat.Page<Model>
  }

  export namespace list {
    export type RequestData = ApiUtil.WithoutPaginationParams<page.RequestData>

    export type ResponseData = ApiUtil.ResponseFormat.Base<Model[]>
  }

  export namespace get {
    export type ResponseData = ApiUtil.ResponseFormat.Base<Model>
  }

  export namespace insertOrUpdate {
    export type RequestData = SetOptional<Model, ApiUtil.CommonModelAttrs>
  }

  interface RoleModel {
    id: string
    name: string
    code: string
    status: StatusEnum
    remark?: string
    createTime: string
    updateTime: string
  }

  export namespace roleList {
    export interface RequestData {
      name?: string
      code?: string
      status?: string
    }

    export type ResponseData = ApiUtil.ResponseFormat.Base<RoleModel[]>
  }
}
