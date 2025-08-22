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
        label: wasAffixed ? '取消固定' : '固定',
        key: 'toggleAffixed',
        icon: createIcon(wasAffixed ? 'mdi:pin-off-outline' : 'mdi:pin-outline'),
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
        icon: createIcon('mdi:open-in-new'),
      },
    ]
    if (!wasAffixed) {
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
