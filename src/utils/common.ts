import type { Merge } from 'type-fest'
import { $t } from '@/locales/locales'

type Label = string
type Value = string | number

/**
 * 创建选项和映射表，可以只解构你需要的某一个值，内部是惰性计算的
 * @example
 * ```ts
 * const data = [
 *   ['value1', 'label1'],
 *   ['value2', 'label2'],
 * ]
 * const { options, mapping } = createOptionsAndMapping(data)
 * ```
 * 如果需要增加额外的属性，可以在选项中添加第三个参数
 * ```ts
 * const data = [
 *   ['value1', 'label1', { customValue: 'customValue1' }],
 *   ['value2', 'label2', { customValue: 'customValue2' }],
 * ]
 * const { options, mapping, mapping2 } = createOptionsAndMapping(data)
 * ```
 */
export function createOptionsAndMapping<
  const T extends [Value, Label, ...any[]][],
>(data: T) {
  return {
    get options() {
      return data.map(([value, label]) => ({ value, label })) as {
        [K in keyof T]: {
          value: T[K] extends [infer V, Label, ...any[]] ? V : never
          label: T[K] extends [Value, infer L, ...any[]] ? L : never
        }
      }
    },
    get mapping() {
      return Object.fromEntries(data) as {
        [K in T[number] as `${K[0]}`]: K[1]
      }
    },
    get mapping2() {
      return Object.fromEntries(
        data.map(([value, , customValue]) => [value, customValue]),
      ) as {
        [K in T[number] as `${K[0]}`]: K extends [any, any, infer X, ...any[]] ? X : void
      }
    },
  }
}

/**
 * 翻译选项，会自动从 locale 中翻译 label，并且会保留其他的属性，类型完整
 * @example
 * ```ts
 * const options = [
 *   { label: 'label1', value: 'value1' },
 *   { label: 'label2', value: 'value2' },
 * ]
 * const translatedOptions = translateOptions(options)
 * ```
 */
export function translateOptions<T extends Recordable[]>(options: T) {
  return options.map(({ label, ...rest }) => ({
    ...rest,
    label: $t(label),
  })) as {
    [Item in keyof T]: T[Item] extends {
      label: MaybeI18nKeyPath
      [x: PropertyKey]: any
    } ? Merge<T[Item], {
      label: Translate<T[Item]['label']>
    }>
      : T[Item]
  }
}
