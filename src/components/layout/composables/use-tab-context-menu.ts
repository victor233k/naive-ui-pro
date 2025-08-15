import type { DropdownOption } from 'naive-ui'
import { Icon } from '@iconify/vue'
import { h, ref } from 'vue'
import { useRouter } from 'vue-router'

export function useTabContextMenu() {
  const router = useRouter()
  const showDropdown = ref(false)
  const contextMenuIndex = ref<number>(-1)
  const dropdownPosition = ref({ x: 0, y: 0 })

  const {
    routes,
    move,
    removeAndEnsureActiveKey,
    removeAllAndEnsureActiveKey,
    removeAfterAndEnsureActiveKey,
    toggleVisitedRouteLockedState,
    removeOtherAndEnsureActiveKey,
    removeBeforeAndEnsureActiveKey,
  } = router.visitedRoutes

  function createIcon(iconName: string) {
    return () =>
      h(Icon, {
        icon: iconName,
        style: 'margin-right: 6px',
      })
  }

  function createDropdownOptions(): DropdownOption[] {
    const currentSelectVisitRoute = routes.value[contextMenuIndex.value]
    if (!currentSelectVisitRoute) {
      return []
    }

    const wasLocked = currentSelectVisitRoute.meta?.locked
    const options = [
      {
        label: wasLocked ? '取消固定' : '固定',
        key: 'toggleLocked',
        icon: createIcon(wasLocked ? 'mdi:pin-off-outline' : 'mdi:pin-outline'),
      },
      {
        label: '关闭左侧',
        key: 'closeLeft',
        icon: createIcon('tabler:arrow-bar-to-left'),
      },
      {
        label: '关闭右侧',
        key: 'closeRight',
        icon: createIcon('tabler:arrow-bar-to-right'),
      },
      {
        label: '关闭其他',
        key: 'closeOther',
        icon: createIcon('tabler:arrow-bar-both'),
      },
      {
        label: '关闭全部',
        key: 'closeAll',
        icon: createIcon('tabler:arrow-autofit-width'),
      },
      {
        label: '在新窗口打开',
        key: 'openInNewTab',
        icon: createIcon('tabler:arrow-autofit-width'),
      },
    ]
    if (!wasLocked) {
      options.unshift({
        label: '关闭',
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

  function handleDropdownSelect(key: string) {
    const index = contextMenuIndex.value
    const currentSelectVisitRoute = routes.value[index]

    switch (key) {
      case 'toggleLocked': {
        toggleVisitedRouteLockedState(index)
        // locked 路由始终排在前面
        const lockedCount = routes.value.filter(route => route.meta?.locked).length
        if (currentSelectVisitRoute.meta?.locked) {
          move(index, lockedCount - 1)
        }
        else {
          move(index, lockedCount)
        }
        break
      }
      case 'close': {
        removeAndEnsureActiveKey(index)
        break
      }
      case 'closeLeft': {
        removeBeforeAndEnsureActiveKey(index)
        break
      }
      case 'closeRight': {
        removeAfterAndEnsureActiveKey(index)
        break
      }
      case 'closeOther': {
        removeOtherAndEnsureActiveKey(index)
        break
      }
      case 'closeAll': {
        removeAllAndEnsureActiveKey()
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
    createDropdownOptions,
    handleContextMenu,
    handleDropdownSelect,
  }
}
