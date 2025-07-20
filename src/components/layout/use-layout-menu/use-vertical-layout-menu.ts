import type { ExpandedKey, MenuKey } from './types'
import type { LayoutMenuReturn, SharedLayoutOptions } from './use-layout-menu'
import { computed } from 'vue'

export function useVerticalLayoutMenu({
  menus,
  activeKey,
  expandedKeys,
}: SharedLayoutOptions) {
  const layout = computed<LayoutMenuReturn>(() => {
    return {
      horizontalMenuProps: {},
      verticalExtraMenuProps: {},
      verticalMenuProps: {
        mode: 'vertical',
        options: menus.value,
        value: activeKey.value,
        expandedKeys: expandedKeys.value,
        onUpdateValue: active,
        onUpdateExpandedKeys: expand,
      },
    }
  })

  function active(key: MenuKey) {
    activeKey.value = key
  }

  function expand(keys: ExpandedKey[]) {
    expandedKeys.value = keys
  }

  return {
    layout,
    active,
    expand,
  }
}
