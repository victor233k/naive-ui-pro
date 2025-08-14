import type { Merge } from 'type-fest'
import { $t } from '@/locales/locales'

type Label = string
type Value = string | number

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
