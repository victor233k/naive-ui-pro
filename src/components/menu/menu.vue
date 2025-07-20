<script setup lang="ts">
import { computed } from 'vue'
import { proMenuProps } from './props'

defineOptions({
  name: 'ProMenu',
})

const props = defineProps(proMenuProps)

const nMenuProps = computed(() => {
  const {
    collapsedShowTitle,
    menuItemHeightWhenCollapsedShowTitle,
    ...rest
  } = props

  if (!collapsedShowTitle || !props.collapsed) {
    return rest
  }

  const itemHeight = menuItemHeightWhenCollapsedShowTitle ?? 64
  return {
    ...rest,
    builtinThemeOverrides: {
      ...(rest.builtinThemeOverrides ?? {}),
      itemHeight: `${itemHeight}px`,
    },
  }
})
</script>

<template>
  <n-menu
    class="pro-menu" :class="[
      collapsed && collapsedShowTitle && 'pro-menu--collapsed-show-title',
    ]" v-bind="nMenuProps"
  />
</template>

<style scoped lang="scss">
.pro-menu.pro-menu--collapsed-show-title {
  :deep(.n-menu-item-content) {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 2px;
  }

  :deep(.n-menu-item-content){
    padding-left: 0 !important;
    padding-right: 0;
  }

  :deep(.n-menu-item-content__icon) {
    margin-right: 0px !important;
  }

  :deep(.n-menu-item-content-header) {
    opacity: 1;
    font-size: 12px;
  }

  :deep(.n-menu-item-content__arrow) {
    display: none;
  }
}

.pro-menu.n-menu.n-menu--collapsed {
  :deep(.n-menu-item-content-header) {
    transition: color .3s var(--n-bezier);
  }
}
</style>
