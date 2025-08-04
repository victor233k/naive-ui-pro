import type { UseNDataTableData, UseNDataTableOptions, UseNDataTableParams, UseRequestPlugin } from 'pro-naive-ui'

export interface UseProNDataTableOptions<
  Data extends UseNDataTableData,
  Params extends UseNDataTableParams,
> extends UseNDataTableOptions<Data, Params> {}

export type UseProNDataTablePlugin<
  Data extends UseNDataTableData,
  Params extends UseNDataTableParams,
> = UseRequestPlugin<Data, Params> extends {
  (fetchInstance: infer F, options: UseProNDataTableOptions<Data, Params>): infer R
  onInit?: (options: UseProNDataTableOptions<Data, Params>) => Partial<infer _>
}
  ? (fetchInstance: F, options: UseProNDataTableOptions<Data, Params>) => R
  : never
