import type { Simplify } from 'type-fest'

export interface PageParams {
  page: number
  pageSize: number
}

export type WithPageParams<T> = Simplify<T & PageParams>
export type WithoutPageParams<T> = Omit<T, keyof PageParams>

export interface BaseModel {
  id: string
  createTime?: string
  updateTime?: string
}

export namespace ResponseFormat {
  export type Base<T> = Simplify<T>

  export type Page<T> = Simplify<
    {
      total: number
      list: T[]
    } & PageParams
  >
}
