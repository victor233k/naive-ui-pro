import { defineAsyncComponent } from 'vue'

export * from './interface'

// 异步加载组件，有利于代码分割
export const ProWangEditor = defineAsyncComponent(() => import('./index.vue'))
