import type { Simplify } from 'type-fest'

declare global {
  export namespace ApiUtil {
    export interface PaginationParams {
      page: number
      pageSize: number
    }

    export type WithPaginationParams<T> = Simplify<T & PaginationParams>
    export type WithoutPaginationParams<T> = Omit<T, keyof PaginationParams>

    export type CommonModelAttrs = 'id' | 'createTime' | 'updateTime'

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
