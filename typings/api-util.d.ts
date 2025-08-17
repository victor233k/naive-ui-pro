import type { Simplify } from 'type-fest'

declare global {
  export namespace ApiUtil {
    interface PaginationParams {
      page: number
      pageSize: number
    }
    export type PaginationResponse<T> = Simplify<{
      list: T[]
      total: number
    }>
    export type WithPaginationParams<T> = Simplify<T & PaginationParams>
    export type WithoutPaginationParams<T> = Simplify<Omit<T, keyof PaginationParams>>
  }
}

export {}
