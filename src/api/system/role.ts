import type { SetOptional } from 'type-fest'
import type { BaseModel, ResponseFormat, WithoutPageParams, WithPageParams } from '../interface'
import http from '@/utils/axios'

export class RoleApi {
  static page(params: RoleApi.page.RequestData) {
    return http.get<RoleApi.page.ResponseData>('/system/role/page', { params })
  }

  static list(params: RoleApi.list.RequestData = {}) {
    return http.get<RoleApi.list.ResponseData>('/system/role/list', { params })
  }

  static get(id: string) {
    return http.get<RoleApi.Model>(`/system/role/${id}`)
  }

  static insertOrUpdate(data: RoleApi.insertOrUpdate.RequestData) {
    return http({
      method: data.id == null ? 'post' : 'put',
      url: '/system/role',
      data,
    })
  }

  static del(id: string | string[]) {
    return http.delete(`/system/role/${id}`)
  }
}

export declare namespace RoleApi {
  export interface Model extends BaseModel {
    name: string
    code: string
    status: string
    remark?: string
  }

  export namespace page {
    export type RequestData = WithPageParams<{
      name?: string
      code?: string
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
