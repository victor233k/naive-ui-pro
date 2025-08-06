import type { SetOptional } from 'type-fest'
import type { linkModeMapping, statusMapping, typeMapping } from './utils/constants'
import { isNil } from 'lodash-es'
import http from '@/utils/axios'

type TypeEnum = keyof typeof typeMapping
type StatusEnum = keyof typeof statusMapping
type LinkModeEnum = keyof typeof linkModeMapping

export class Api {
  static list(params: Api.list.RequestData = {}) {
    return http.get<Api.list.ResponseData>('/system/menu/list', { params })
  }

  static get(id: string) {
    return http.get<Api.Model>(`/system/menu/${id}`)
  }

  static insertOrUpdate(data: Api.insertOrUpdate.RequestData) {
    return http({
      method: isNil(data.id) ? 'post' : 'put',
      url: '/system/menu',
      data,
    })
  }

  static del(id: string | string[]) {
    return http.delete(`/system/menu/${id}`)
  }
}

export declare namespace Api {
  export interface Model {
    id: string
    parentId?: string
    type: TypeEnum
    title: string
    code: string
    routePath?: string
    routeFile?: string
    icon?: string
    link?: string
    linkMode: LinkModeEnum
    status: StatusEnum
    sort: number
    keepAlive?: boolean
    remark?: string
    createTime?: string
    updateTime?: string
  }

  export namespace list {
    export interface RequestData {
      type?: string
      title?: string
      code?: string
      status?: string
    }

    export type ResponseData = ApiUtil.ResponseFormat.Base<Model[]>
  }

  export namespace get {
    export type ResponseData = ApiUtil.ResponseFormat.Base<Model>
  }

  export namespace insertOrUpdate {
    export type RequestData = SetOptional<Model, ApiUtil.CommonModelAttrs>
  }
}
