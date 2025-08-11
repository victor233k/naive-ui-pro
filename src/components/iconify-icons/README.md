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
