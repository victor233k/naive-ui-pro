import type { RouteRecordNameGeneric } from 'vue-router'
import { isSymbol } from 'lodash-es'

export function normalizeRouteName(name: RouteRecordNameGeneric) {
  if (!name) {
    return ''
  }
  if (isSymbol(name)) {
    return name.toString()
  }
  return name
}
