import type { DropdownOption } from 'naive-ui'
import { Icon } from '@iconify/vue'
import { storeToRefs } from 'pinia'
import { h, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useTabsStore } from '@/store/use-tabs-store'
import { useTabs } from './use-tabs'

export function useTabContextMenu() {
  const router = useRouter()
  const showDropdown = ref(false)
  const contextMenuIndex = ref<number>(-1)
  const dropdownPosition = ref({ x: 0, y: 0 })

  const {
    tabs,
  } = storeToRefs(useTabsStore())
  const {
    handleRemoveTab,
    handleToggleAffix,
    handleCloseAllTabs,
    handleCloseLeftTabs,
    handleCloseRightTabs,
    handleCloseOtherTabs,
  } = useTabs()

  function createIcon(iconName: string) {
    return () =>
      h(Icon, {
        icon: iconName,
        style: 'margin-right: 6px',
      })
  }

  function createDropdownOptions(): DropdownOption[] {
    const currentTab = tabs.value[contextMenuIndex.value]
    if (!currentTab) {
      return []
    }

    const wasAffix = currentTab.affix
    const options = [
      {
        label: wasAffix ? '取消固定' : '固定',
        key: 'toggleAffix',
        icon: createIcon(wasAffix ? 'mdi:pin-off-outline' : 'mdi:pin-outline'),
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
    if (!wasAffix) {
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
    const currentTab = tabs.value[index]

    switch (key) {
      case 'toggleAffix': {
        handleToggleAffix(index)
        break
      }
      case 'close': {
        handleRemoveTab(index)
        break
      }
      case 'closeLeft': {
        handleCloseLeftTabs(index)
        break
      }
      case 'closeRight': {
        handleCloseRightTabs(index)
        break
      }
      case 'closeOther': {
        handleCloseOtherTabs(index)
        break
      }
      case 'closeAll': {
        handleCloseAllTabs()
        break
      }
      case 'openInNewTab': {
        const href = router.options.history.createHref(currentTab.fullPath)
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
