import type { Simplify } from 'type-fest'

declare global {
  export namespace Api {
    export interface PaginationParams {
      page: number
      pageSize: number
    }

    export type WithPaginationParams<T> = Simplify<T & PaginationParams>
    export type WithoutPaginationParams<T> = Omit<T, keyof PaginationParams>

    export interface BaseModel {
      id: string
      createTime: string
      updateTime: string
    }

    export namespace ResponseFormat {
      export type Base<T> = Simplify<T>

      export type Page<T> = Simplify<
        {
          total: number
          list: T[]
        } & PaginationParams
      >
    }
  }
}

export {}
