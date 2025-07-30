import type { ProTagsConfig } from 'pro-naive-ui'
import type { Dict, DictItem } from './interface'
import { renderProTags } from 'pro-naive-ui'

class DictStatic extends Map<string, DictItem> implements Dict {
  items: () => DictItem[]

  constructor(items: DictItem[]) {
    super(items.map(item => [item.value, item]))
    this.items = () => items
  }
}

export function createDict(items: DictItem[]): Dict {
  return new DictStatic(items)
}

export function renderProTagByDictValue(
  val: string,
  dict: Dict,
  config: ProTagsConfig = {},
) {
  const item = dict.get(val)
  return renderProTags({
    type: item?.tagType,
    content: item?.label,
    ...config,
  })
}
