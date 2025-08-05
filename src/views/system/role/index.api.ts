import type { SetOptional } from 'type-fest'
import type { statusMapping } from './utils/constants'
import { isNil } from 'lodash-es'
import http from '@/utils/axios'

type StatusEnum = keyof typeof statusMapping

export class Api {
  static page(params: Api.page.RequestData) {
    return http.get<Api.page.ResponseData>('/system/role/page', { params })
  }

  static list(params: Api.list.RequestData = {}) {
    return http.get<Api.list.ResponseData>('/system/role/list', { params })
  }

  static get(id: string) {
    return http.get<Api.Model>(`/system/role/${id}`)
  }

  static insertOrUpdate(data: Api.insertOrUpdate.RequestData) {
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

export declare namespace Api {
  export interface Model {
    id: string
    name: string
    code: string
    status: StatusEnum
    remark?: string
    createTime: string
    updateTime: string
  }

  export namespace page {
    export type RequestData = ApiUtil.WithPaginationParams<{
      name?: string
      code?: string
      status?: string
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
}
