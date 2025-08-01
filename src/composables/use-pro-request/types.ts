import type { UseRequestOptions, UseRequestPlugin } from 'pro-naive-ui'

export interface UseProRequestOptions<Data, Params extends any[]> extends UseRequestOptions<Data, Params> {}

export type UseProRequestPlugin<Data, Params extends any[]> = UseRequestPlugin<Data, Params> extends {
  (fetchInstance: infer F, options: UseRequestOptions<Data, Params>): infer R
  onInit?: (options: UseRequestOptions<Data, Params>) => Partial<infer _>
}
  ? (fetchInstance: F, options: UseProRequestOptions<Data, Params>) => R
  : never
