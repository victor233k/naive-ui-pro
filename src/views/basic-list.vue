<script setup lang="ts">
import { ref } from 'vue'

import { useMenuStore } from '@/store/use-menu'

// defineOptions({ name: 'basic-list' })

const a = useMenuStore()

function handleClick() {
  console.log(a.menus, 'a.menus')
}

const value = ref('')
</script>

<template>
  <div>
    list
    {{ $options.name }}
    <n-button @click="handleClick">
      点击
    </n-button>
    <n-input v-model="value" placeholder="请输入内容" />
    <n-button @click="$router.push({ name: 'basic-info' })">
      跳转到 basic-info 页
    </n-button>
    <n-button @click="$router.push({ name: 'basic-list' })">
      跳转到 basic-list 页
    </n-button>
    <n-button @click="$router.push({ name: 'basic-demo' })">
      跳转到 basic-demo 页
    </n-button>
    <n-button @click="$router.push({ name: 'Login' })">
      跳转到 login 页
    </n-button>
    <n-button @click="$router.push({ name: 'r-list' })">
      跳转到 a-list 页
    </n-button>
    <n-button @click="$router.push({ name: 'r' })">
      跳转到 r 页
    </n-button>
    <n-button @click="$router.push({ name: 'basic-list-item' })">
      跳转到 三级菜单 basic-list-item 页
    </n-button>
  </div>
</template>
