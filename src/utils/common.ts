type Label = string
type Value = string | number
export function createOptionsAndMapping<const T extends [Value, Label, any?][]>(data: T) {
  const options = data.map(([value, label]) => ({ value, label })) as {
    [K in keyof T]: {
      value: T[K] extends [infer V, Label, any?] ? V : never
      label: T[K] extends [Value, infer L, any?] ? L : never
    }
  }
  const mapping = Object.fromEntries(data) as {
    [K in T[number] as `${K[0]}`]: K[1]
  }
  const mapping2 = Object.fromEntries(
    data.map(([value, , customValue]) => [value, customValue]),
  ) as {
    [K in T[number] as `${K[0]}`]: K extends [any, any, infer X] ? X : void
  }
  return {
    options,
    mapping,
    mapping2,
  }
}
