import type { Merge, Simplify } from 'type-fest'

interface TablePaginationParams {
  page: number
  pageSize: number
}

declare global {
  type WithTablePaginationParams<T> = Merge<T, TablePaginationParams>
  type OmitTablePaginationParams<T> = Simplify<Omit<T, keyof TablePaginationParams>>
  interface TablePaginationResponse<T> {
    total: number
    list: T[]
  }
}

export {}
