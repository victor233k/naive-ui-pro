<script setup lang="ts">
import { createProForm } from 'pro-naive-ui'
import { ref } from 'vue'
import LoginIllustration from './login-illustration.vue'

const form = createProForm({
  onSubmit: (values) => {
    console.log(values)
  },
})

const loading = ref(false)
const rememberMe = ref(false)
</script>

<template>
  <div class="h-screen w-full flex bg-white dark:bg-dark-900">
    <!-- 左侧区域 -->
    <div class="hidden lg:flex w-[62%] relative overflow-hidden bg-gradient-to-b from-[#F8FAFF] via-[#F3F6FF] to-[#EEF2FF] dark:from-[#1C1C2C] dark:via-[#1E1E38] dark:to-[#1F1F42]">
      <!-- 主背景渐变叠加 -->
      <div class="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.9)_0%,rgba(243,246,255,0.6)_100%)] dark:bg-[linear-gradient(135deg,rgba(26,26,42,0.6)_0%,rgba(28,28,54,0.3)_100%)]" />
      <!-- 柔和的网格背景 -->
      <div class="absolute inset-0 opacity-[0.02] dark:opacity-[0.04]" style="background-image: linear-gradient(#6366F1 0.5px, transparent 0.5px), linear-gradient(to right, #6366F1 0.5px, transparent 0.5px); background-size: 48px 48px;" />
      <!-- 高级渐变光韵效果 -->
      <div class="absolute inset-0">
        <!-- 主要光韵 - 增加对比度和深度 -->
        <div class="absolute inset-0 bg-[linear-gradient(135deg,rgba(99,102,241,0.12)_0%,rgba(79,70,229,0.08)_25%,rgba(99,102,241,0.04)_50%,rgba(147,197,253,0.02)_75%,transparent_100%)] dark:bg-[linear-gradient(135deg,rgba(99,102,241,0.15)_0%,rgba(79,70,229,0.1)_25%,rgba(99,102,241,0.06)_50%,rgba(147,197,253,0.03)_75%,transparent_100%)]" />
        <!-- 补充光韵 - 添加更柔和的过渡 -->
        <div class="absolute inset-0 bg-[linear-gradient(165deg,rgba(79,70,229,0.07)_0%,rgba(147,197,253,0.04)_40%,transparent_80%)] dark:bg-[linear-gradient(165deg,rgba(79,70,229,0.09)_0%,rgba(147,197,253,0.05)_40%,transparent_80%)]" />
        <!-- 深度增强层 -->
        <div class="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(255,255,255,0.4)_25%,rgba(243,246,255,0.6)_50%,rgba(238,242,255,0.2)_75%,transparent_100%)] dark:bg-[linear-gradient(180deg,transparent_0%,rgba(28,28,44,0.4)_25%,rgba(30,30,56,0.6)_50%,rgba(31,31,66,0.2)_75%,transparent_100%)]" />
        <!-- 顶部光晕效果 -->
        <div class="absolute top-0 left-0 right-0 h-[30%] bg-[linear-gradient(180deg,rgba(255,255,255,0.2)_0%,transparent_100%)] dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.05)_0%,transparent_100%)]" />
      </div>
      <div class="relative z-10 w-full flex flex-col">
        <div class="flex items-center gap-3 p-8">
          <img src="@/assets/logo.svg" alt="Logo" class="w-8 h-8">
          <span class="text-xl font-semibold text-gray-900 dark:text-gray-100">Naive UI Pro</span>
        </div>
        <div class="flex-grow flex flex-col items-center justify-center px-8">
          <div class="max-w-2xl w-full">
            <div class="login-illustration w-3/4 mx-auto relative mb-4">
              <div class="relative z-10">
                <LoginIllustration />
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
            <span class="text-xl font-semibold text-gray-900 dark:text-white">Naive UI Pro</span>
          </div>

          <div class="mb-12">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">
              账号登录
            </h1>
            <p class="mt-3 text-base text-gray-500 dark:text-gray-400">
              请使用您的账号密码登录系统
            </p>
          </div>

          <pro-form
            :form="form"
            label-placement="left"
            size="large"
          >
            <pro-input
              required
              path="username"
              placeholder="请输入用户名"
            />
            <pro-password
              required
              path="password"
              placeholder="请输入密码"
              :field-props="{
                showPasswordOn: 'click',
              }"
            />
            <div class="flex justify-between items-center mb-6">
              <pro-checkbox
                path="rememberMe"
                size="small"
                :show-feedback="false"
              >
                记住我
              </pro-checkbox>
              <n-button text type="primary">
                忘记密码？
              </n-button>
            </div>

            <n-button
              type="primary"
              block
              size="large"
              :loading="loading"
              :disabled="loading"
              attr-type="submit"
            >
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
        Copyright © 2024 Naive UI Pro
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
