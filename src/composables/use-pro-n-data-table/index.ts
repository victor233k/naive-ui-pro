import type { UseNDataTableData, UseNDataTableParams, UseNDataTableReturn, UseNDataTableService, UseRequestPlugin } from 'pro-naive-ui'
import type { UseProNDataTableOptions } from './types'
import { useNDataTable } from 'pro-naive-ui'
import { messageTipAfterRequestFinallyPlugin } from './plugins/message-tip-after-request-finally-plugin'

/**
 * 增强 useNDataTable 能力
 */
export function useProNDataTable<Data extends UseNDataTableData, Params extends UseNDataTableParams>(
  service: UseNDataTableService<Data, Params>,
  options?: UseProNDataTableOptions<Data, Params>,
  plugins?: UseRequestPlugin<Data, Params>[],
): UseNDataTableReturn<Data, Params> {
  return useNDataTable(service, options, [
    ...(plugins ?? []),
    messageTipAfterRequestFinallyPlugin,
  ] as UseRequestPlugin<Data, Params>[])
}
