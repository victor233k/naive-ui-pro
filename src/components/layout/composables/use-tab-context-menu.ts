import type { DropdownOption } from 'naive-ui'
import { Icon } from '@iconify/vue'
import { h, ref } from 'vue'
import { useRouter } from 'vue-router'
import { $t } from '@/locales/locales'

export function useTabContextMenu() {
  const router = useRouter()
  const showDropdown = ref(false)
  const contextMenuIndex = ref<number>(-1)
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
    const currentSelectVisitRoute = routes[contextMenuIndex.value]
    if (!currentSelectVisitRoute) {
      return []
    }

    const wasAffixed = currentSelectVisitRoute.meta?.affixed
    const options = [
      {
        label: wasAffixed ? $t('common.layout.tabs.unpin') : $t('common.layout.tabs.pin'),
        key: 'toggleAffixed',
        icon: createIcon(wasAffixed ? 'mdi:pin-off-outline' : 'mdi:pin-outline'),
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
        label: $t('common.layout.tabs.closeAll'),
        key: 'closeAll',
        icon: createIcon('tabler:arrow-autofit-width'),
      },
      {
        label: $t('common.layout.tabs.openInNewWindow'),
        key: 'openInNewTab',
        icon: createIcon('mdi:open-in-new'),
      },
    ]
    if (!wasAffixed) {
      options.unshift({
        label: $t('common.layout.tabs.close'),
        key: 'close',
        icon: createIcon('ant-design:close-outlined'),
      })
    }
    return options
  }

  function handleContextMenu(index: number, e: MouseEvent) {
    contextMenuIndex.value = index
    dropdownPosition.value = { x: e.clientX, y: e.clientY }
    showDropdown.value = true
  }

  async function handleDropdownSelect(key: string) {
    const index = contextMenuIndex.value
    const currentSelectVisitRoute = routes[index]

    switch (key) {
      case 'toggleAffixed': {
        currentSelectVisitRoute.meta.affixed = !currentSelectVisitRoute.meta?.affixed
        // affixed 路由始终排在前面
        const affixedCount = routes.filter(route => route.meta?.affixed).length
        if (currentSelectVisitRoute.meta?.affixed) {
          await move(index, affixedCount - 1)
        }
        else {
          await move(index, affixedCount)
        }
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
        await removes(0, index)
        await removes(index + 1, routes.length)
        break
      }
      case 'closeAll': {
        await removes(0, routes.length)
        break
      }
      case 'openInNewTab': {
        const href = router.options.history.createHref(currentSelectVisitRoute.fullPath)
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
