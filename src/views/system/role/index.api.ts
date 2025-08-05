import type { SetOptional } from 'type-fest'
import type { statusMapping } from './utils/constants'
import { isNil } from 'lodash-es'
import http from '@/utils/axios'

type StatusEnum = keyof typeof statusMapping

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
      method: isNil(data.id) ? 'post' : 'put',
      url: '/system/role',
      data,
    })
  }

  static del(id: string | string[]) {
    return http.delete(`/system/role/${id}`)
  }
}

export declare namespace RoleApi {
  export interface Model extends Api.BaseModel {
    name: string
    code: string
    status: StatusEnum
    remark?: string
  }

  export namespace page {
    export type RequestData = Api.WithPaginationParams<{
      name?: string
      code?: string
      status?: string
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
}
