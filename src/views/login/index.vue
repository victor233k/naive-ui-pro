<script setup lang="ts">
import { useNotification } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { createProForm } from 'pro-naive-ui'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { HOME_ROUTE_PATH } from '@/router/routes'
import { useAppStore } from '@/store/use-app-store'
import { useUserStore } from '@/store/use-user-store'
import IKun from './ikun.vue'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const userStore = useUserStore()
const notification = useNotification()
const { title } = storeToRefs(useAppStore())

const form = createProForm({
  initialValues: {
    username: 'super',
    password: '123456',
    rememberMe: true,
  },
  onSubmit: async (values) => {
    try {
      loading.value = true
      const user = await userStore.login(values)
      const redirect = route.query.redirect as string ?? HOME_ROUTE_PATH
      await router.push(redirect)
      notification.success({
        title: '登录成功',
        content: `欢迎回来，${user.name}`,
        duration: 2000,
      })
    }
    catch (error: any) {
      notification.error({
        title: '登录失败',
        content: error.message,
        duration: 2000,
      })
    }
    finally {
      loading.value = false
    }
  },
})
</script>

<template>
  <div class="h-screen w-full flex bg-white dark:bg-dark-900">
    <!-- 左侧区域 -->
    <div class="hidden lg:flex w-[62%] relative overflow-hidden">
      <!-- 主背景 -->
      <div
        class="absolute inset-0 blur-2xl"
        style="background: linear-gradient(154deg,#07070915 30%,#D5E6FF 60%,#07070915 10%)"
      />
      <div class="relative z-10 w-full flex flex-col">
        <div class="flex items-center gap-3 p-8">
          <img src="@/assets/logo.svg" alt="Logo" class="w-8 h-8">
          <span class="text-xl font-semibold text-gray-800 dark:text-gray-100">{{ title }}</span>
        </div>
        <div class="flex-grow flex items-center justify-center">
          <div class="w-[85%] max-w-[480px] mt-[-100px]">
            <div class="login-illustration relative">
              <div class="relative z-10">
                <i-kun />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧登录区域 -->
    <div class="w-full lg:w-[38%] flex flex-col bg-white dark:bg-dark-800">
      <div class="flex-grow flex items-center justify-center">
        <div class="w-full max-w-[420px] px-6 lg:px-12">
          <div class="lg:hidden flex items-center justify-center gap-2 mb-12">
            <img src="@/assets/logo.svg" alt="Logo" class="w-8 h-8">
            <span class="text-xl font-semibold text-gray-900 dark:text-white">{{ title }}</span>
          </div>

          <div class="mb-12">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">
              账号登录
            </h1>
            <p class="mt-3 text-base text-gray-500 dark:text-gray-400">
              请使用您的账号密码登录系统
            </p>
          </div>

          <pro-form :form="form" size="large" :loading="loading" label-placement="left">
            <pro-input required path="username" placeholder="请输入用户名" />
            <pro-password
              required path="password" placeholder="请输入密码" :field-props="{
                showPasswordOn: 'click',
              }"
            />
            <div class="flex justify-between items-center mb-6">
              <pro-checkbox path="rememberMe" size="small" :show-feedback="false">
                记住我
              </pro-checkbox>
              <n-button text type="primary">
                忘记密码？
              </n-button>
            </div>

            <n-button type="primary" block size="large" :loading="loading" :disabled="loading" attr-type="submit">
              {{ loading ? '登录中...' : '登录' }}
            </n-button>
            <div class="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
              还没有账号？ <n-button text type="primary" class="font-medium">
                立即注册
              </n-button>
            </div>
          </pro-form>
        </div>
      </div>
      <div class="p-8 text-center text-gray-500 dark:text-gray-400 text-sm">
        Copyright © 2025 {{ title }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-illustration {
  animation: float 6s ease-in-out infinite;
  filter: drop-shadow(0 20px 30px rgba(0, 0, 0, 0.1));
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}
</style>
