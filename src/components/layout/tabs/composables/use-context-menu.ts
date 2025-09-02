import type { DropdownOption } from 'naive-ui'
import { Icon } from '@iconify/vue'
import { h, ref } from 'vue'
import { useRouter } from 'vue-router'
import { $t } from '@/locales/locales'

export function useContextMenu() {
  const router = useRouter()
  const showDropdown = ref(false)
  const contextMenuIndex = ref(-1)
  const dropdownPosition = ref({ x: 0, y: 0 })

  const {
    routes,
    move,
    remove,
    removes,
  } = router.visitedRoutesPlugin

  function createIcon(iconName: string) {
    return () =>
      h(Icon, {
        icon: iconName,
        style: 'margin-right: 6px',
      })
  }

  function createDropdownOptions(): DropdownOption[] {
    if (!routes[contextMenuIndex.value]) {
      return []
    }

    const fixed = routes[contextMenuIndex.value].meta?.fixedInTabs
    const options = [
      {
        label: fixed ? $t('common.layout.tabs.unpin') : $t('common.layout.tabs.pin'),
        key: 'toggleFixed',
        icon: createIcon(fixed ? 'mdi:pin-off-outline' : 'mdi:pin-outline'),
      },
      {
        label: $t('common.layout.tabs.closeLeft'),
        key: 'closeLeft',
        icon: createIcon('tabler:arrow-bar-to-left'),
      },
      {
        label: $t('common.layout.tabs.closeRight'),
        key: 'closeRight',
        icon: createIcon('tabler:arrow-bar-to-right'),
      },
      {
        label: $t('common.layout.tabs.closeOthers'),
        key: 'closeOther',
        icon: createIcon('tabler:arrow-bar-both'),
      },
      {
        label: $t('common.layout.tabs.openInNewWindow'),
        key: 'openInNewWindow',
        icon: createIcon('mdi:open-in-new'),
      },
      {
        label: $t('common.layout.tabs.close'),
        key: 'close',
        icon: createIcon('ant-design:close-outlined'),
      },
    ]
    return options
  }

  function handleContextMenu(index: number, e: MouseEvent) {
    contextMenuIndex.value = index
    dropdownPosition.value = { x: e.clientX, y: e.clientY }
    showDropdown.value = true
  }

  async function handleDropdownSelect(key: string) {
    const index = contextMenuIndex.value
    const route = routes[index]

    switch (key) {
      case 'toggleFixed': {
        route.meta ??= {}
        route.meta.fixedInTabs = !route.meta.fixedInTabs
        const fixedCount = routes.filter(r => r.meta?.fixedInTabs).length
        // 目标索引 = 固定区长度变化后的右边界位置
        const targetIndex = route.meta.fixedInTabs ? fixedCount - 1 : fixedCount
        await move(index, Math.max(0, targetIndex))
        break
      }
      case 'close': {
        await remove(index)
        break
      }
      case 'closeLeft': {
        await removes(0, index)
        break
      }
      case 'closeRight': {
        await removes(index + 1, routes.length)
        break
      }
      case 'closeOther': {
        await removes(index + 1, routes.length)
        await removes(0, index)
        break
      }
      case 'openInNewWindow': {
        const href = router.options.history.createHref(route.path)
        window.open(href, '_blank')
        break
      }
    }
    showDropdown.value = false
  }

  return {
    showDropdown,
    contextMenuIndex,
    dropdownPosition,
    handleContextMenu,
    handleDropdownSelect,
    createDropdownOptions,
  }
}
