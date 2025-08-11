# ProIconifyIcons & ProIconifyIcons2

我们提供了 2 种回显风格的 `Icon 选择器`组件，可以根据需要自行选用一种，以下示例也适合 `ProIconifyIcons2`

在 `pro-search-form`、`pro-edit-data-table` 中使用（该组件需要被注册才能在 json 中使用）

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
