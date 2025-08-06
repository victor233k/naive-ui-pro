# ProIconifyIcons
在 `pro-search-form` 中使用（该组件需要被注册才能在 json 中使用）
```ts
const columns = [
  {
    title: '图标',
    path: 'icon',
    field: 'iconify-icons',
    fieldProps: {
      ...nSelectProps, // 可以传递所有的 n-select props
    }
  }
]
```

在 `pro-form`、`pro-modal-form`、`pro-drawer-form` 中使用
```tsx
<pro-iconify-icons
  title="图标"
  path="icon"
  :fieldProps="{
    ...nSelectProps, // 可以传递所有的 n-select props
  }"
/>
```

接入到 `pro-field` 组件中，具体请参考[接入自定义组件](https://naive-ui.pro-components.cn/zh-CN/os-theme/components/field#custom-component-1.vue)
```vue
<script setup lang="ts">
const {
  selectProps,
  renderSingleTag,
  renderMultipleTag
} = useIconifyIcons()
</script>

<template>
  <pro-field>
    <template #input>
      <n-select
        v-bind="selectProps"
        :render-tag="renderMultipleTag"
      ></n-select>
    </template>
  </pro-field>
</template>
```
