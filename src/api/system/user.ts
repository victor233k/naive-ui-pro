import type { SetOptional } from 'type-fest'
import type { BaseModel, ResponseFormat, WithoutPageParams, WithPageParams } from '../interface'
import http from '@/utils/axios'

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
      method: data.id == null ? 'post' : 'put',
      url: '/system/user',
      data,
    })
  }

  static del(id: string | string[]) {
    return http.delete(`/system/user/${id}`)
  }
}

export declare namespace UserApi {
  export interface Model extends BaseModel {
    username: string
    nickname: string
    gender: string
    roleIds: string[]
    password: string
    email?: string
    phone?: string
    status: string
    remark?: string
  }

  export namespace page {
    export type RequestData = WithPageParams<{
      username?: string
      nickname?: string
      gender?: string
      status?: string
    }>

    export type ResponseData = ResponseFormat.Page<Model>
  }

  export namespace list {
    export type RequestData = WithoutPageParams<page.RequestData>

    export type ResponseData = ResponseFormat.Base<Model[]>
  }

  export namespace get {
    export type ResponseData = ResponseFormat.Base<Model>
  }

  export namespace insertOrUpdate {
    export type RequestData = SetOptional<Model, 'id'>
  }
}
