<script setup lang="ts">
import { Icon as icon } from '@iconify/vue'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useUserStore } from '@/store/use-user-store'

const {
  user,
} = storeToRefs(useUserStore())

// 当前日期
const formattedDate = computed(() => {
  const date = new Date()
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  })
})

// 统计卡片数据
const statCards = [
  {
    title: '总访问量',
    value: '12,846',
    icon: 'mdi:eye-outline',
    trend: 'up',
    rate: '16.2%',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    iconColor: '#1677ff',
  },
  {
    title: '用户总数',
    value: '3,275',
    icon: 'mdi:account-outline',
    trend: 'up',
    rate: '8.1%',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
    iconColor: '#52c41a',
  },
  {
    title: '订单总数',
    value: '1,592',
    icon: 'mdi:cart-outline',
    trend: 'down',
    rate: '3.2%',
    bgColor: 'bg-orange-100 dark:bg-orange-900/30',
    iconColor: '#fa8c16',
  },
  {
    title: '总收入',
    value: '¥25,648',
    icon: 'mdi:credit-card-outline',
    trend: 'up',
    rate: '12.5%',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    iconColor: '#722ed1',
  },
]

// 最近活动数据
const recentActivities = [
  {
    user: '张三',
    avatar: 'mdi:account-circle',
    action: '完成了任务',
    target: '系统架构设计',
    time: '10分钟前',
    color: '#1677ff',
  },
  {
    user: '李四',
    avatar: 'mdi:account-circle',
    action: '评论了文档',
    target: '产品需求说明',
    time: '30分钟前',
    color: '#52c41a',
  },
  {
    user: '王五',
    avatar: 'mdi:account-circle',
    action: '上传了文件',
    target: '测试报告.pdf',
    time: '1小时前',
    color: '#722ed1',
  },
  {
    user: '赵六',
    avatar: 'mdi:account-circle',
    action: '创建了任务',
    target: '用户反馈处理',
    time: '2小时前',
    color: '#fa8c16',
  },
  {
    user: '陈七',
    avatar: 'mdi:account-circle',
    action: '更新了状态',
    target: '服务器部署',
    time: '3小时前',
    color: '#13c2c2',
  },
  {
    user: '周八',
    avatar: 'mdi:account-circle',
    action: '解决了问题',
    target: '登录验证失败',
    time: '4小时前',
    color: '#eb2f96',
  },
  {
    user: '吴九',
    avatar: 'mdi:account-circle',
    action: '合并了代码',
    target: '功能分支',
    time: '昨天',
    color: '#faad14',
  },
  {
    user: '郑十',
    avatar: 'mdi:account-circle',
    action: '关闭了问题',
    target: '性能优化',
    time: '昨天',
    color: '#597ef7',
  },
]

// 项目动态数据
const projectUpdates = [
  {
    title: '新版本发布',
    desc: 'v2.3.0 版本已成功发布，修复了多个已知问题',
    time: '今天 10:30',
    icon: 'mdi:tag-outline',
    color: '#1677ff',
  },
  {
    title: '系统维护通知',
    desc: '系统将于本周六进行例行维护，预计耗时2小时',
    time: '昨天 14:20',
    icon: 'mdi:tools',
    color: '#fa8c16',
  },
  {
    title: '功能更新预告',
    desc: '下个版本将新增数据分析模块，敬请期待',
    time: '3天前',
    icon: 'mdi:lightbulb-outline',
    color: '#52c41a',
  },
  {
    title: '安全更新提醒',
    desc: '请所有用户及时更新密码，增强账户安全性',
    time: '4天前',
    icon: 'mdi:shield-alert-outline',
    color: '#ff4d4f',
  },
  {
    title: '用户反馈改进',
    desc: '根据用户反馈，优化了界面交互和响应速度',
    time: '5天前',
    icon: 'mdi:comment-text-outline',
    color: '#13c2c2',
  },
  {
    title: '新功能调研',
    desc: '正在调研AI智能分析功能，欢迎提供建议',
    time: '1周前',
    icon: 'mdi:flask-outline',
    color: '#722ed1',
  },
]
</script>

<template>
  <div class="p-4 md:p-6">
    <!-- 欢迎区域 -->
    <div class="mb-8">
      <n-card class="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90">
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div class="flex items-center">
            <div class="w-14 h-14 mr-4 flex items-center justify-center">
              <img
                src="/src/assets/logo.svg"
                alt="Logo"
                class="size-full"
              >
            </div>
            <div>
              <h1 class="text-xl md:text-2xl font-medium mb-2">
                欢迎回来，{{ user.name }}
              </h1>
              <p class="text-gray-500 dark:text-gray-400">
                今天是{{ formattedDate }}
              </p>
            </div>
          </div>
          <div class="mt-4 md:mt-0 flex items-center">
            <div class="flex items-center">
              <div class="text-center px-4">
                <div class="text-lg font-semibold">
                  18
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  已完成
                </div>
              </div>
              <div class="h-10 w-px bg-gray-200 dark:bg-gray-700 mx-2" />
              <div class="text-center px-4">
                <div class="text-lg font-semibold">
                  6
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  进行中
                </div>
              </div>
              <div class="h-10 w-px bg-gray-200 dark:bg-gray-700 mx-2" />
              <div class="text-center px-4">
                <div class="text-lg font-semibold">
                  3
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  新消息
                </div>
              </div>
            </div>
          </div>
        </div>
      </n-card>
    </div>

    <!-- 数据概览卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      <n-card
        v-for="(card, index) in statCards"
        :key="index"
        class="hover:shadow-lg transition-all duration-300 border-0 shadow-sm"
      >
        <div class="flex justify-between items-center">
          <div>
            <p class="text-gray-500 dark:text-gray-400 mb-1 text-sm">
              {{ card.title }}
            </p>
            <h3 class="text-2xl font-semibold">
              {{ card.value }}
            </h3>
            <div class="flex items-center mt-2">
              <span
                class="inline-flex items-center"
                :class="card.trend === 'up' ? 'text-green-500' : 'text-red-500'"
              >
                <icon
                  :icon="card.trend === 'up' ? 'mdi:arrow-up' : 'mdi:arrow-down'"
                  width="16"
                  class="mr-1"
                />
                {{ card.rate }}
              </span>
              <span class="text-gray-500 dark:text-gray-400 ml-1">较上周</span>
            </div>
          </div>
          <div
            class="flex items-center justify-center w-12 h-12 rounded-full"
            :class="card.bgColor"
          >
            <icon
              :icon="card.icon"
              :color="card.iconColor"
              width="28"
            />
          </div>
        </div>
      </n-card>
    </div>

    <!-- 活动记录和项目动态 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- 活动记录 -->
      <n-card
        title="活动记录"
        class="h-full shadow-sm border-0"
      >
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center">
            <icon
              icon="mdi:history"
              color="#1677ff"
              width="20"
              class="mr-2"
            />
            <span class="text-sm font-medium">最近用户活动</span>
          </div>
          <n-button
            text
            size="small"
          >
            <span class="flex items-center text-xs">
              查看全部
              <icon
                icon="mdi:chevron-right"
                width="14"
                class="ml-1"
              />
            </span>
          </n-button>
        </div>
        <div class="space-y-1">
          <div
            v-for="(activity, index) in recentActivities.slice(0, 8)"
            :key="index"
            class="flex items-start py-1.5 border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/30 px-2 rounded transition-colors duration-200 group"
          >
            <div
              class="w-7 h-7 rounded-full flex items-center justify-center mr-2"
              :style="{ backgroundColor: `${activity.color}20` }"
            >
              <icon
                :icon="activity.avatar"
                :color="activity.color"
                width="16"
              />
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex flex-wrap items-center text-sm">
                <span class="font-medium mr-1 truncate">{{ activity.user }}</span>
                <span class="text-gray-500 dark:text-gray-400 mr-1 truncate">{{ activity.action }}</span>
                <span class="font-medium text-primary truncate">{{ activity.target }}</span>
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 flex items-center">
                <icon
                  icon="mdi:clock-outline"
                  width="12"
                  class="mr-1"
                />
                {{ activity.time }}
              </div>
            </div>
            <div>
              <n-button
                text
                size="small"
                class="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <icon
                  icon="mdi:dots-horizontal"
                  width="14"
                />
              </n-button>
            </div>
          </div>
        </div>
      </n-card>

      <!-- 项目动态 -->
      <n-card
        title="项目动态"
        class="h-full shadow-sm border-0"
      >
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center">
            <icon
              icon="mdi:bell-outline"
              color="#fa8c16"
              width="20"
              class="mr-2"
            />
            <span class="text-sm font-medium">系统公告与更新</span>
          </div>
          <n-button
            text
            size="small"
          >
            <span class="flex items-center text-xs">
              查看全部
              <icon
                icon="mdi:chevron-right"
                width="14"
                class="ml-1"
              />
            </span>
          </n-button>
        </div>
        <div class="space-y-1">
          <div
            v-for="(update, index) in projectUpdates"
            :key="index"
            class="flex items-start py-1.5 border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/30 px-2 rounded transition-colors duration-200 group"
          >
            <div
              class="w-7 h-7 rounded-full flex items-center justify-center mr-2"
              :style="{ backgroundColor: `${update.color}20` }"
            >
              <icon
                :icon="update.icon"
                :color="update.color"
                width="16"
              />
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex flex-wrap items-center text-sm">
                <span class="font-medium text-primary truncate">{{ update.title }}</span>
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 flex items-center">
                <icon
                  icon="mdi:clock-outline"
                  width="12"
                  class="mr-1"
                />
                {{ update.time }}
              </div>
              <div class="text-xs text-gray-600 dark:text-gray-300 mt-1">
                {{ update.desc }}
              </div>
            </div>
            <div>
              <n-button
                text
                size="small"
                class="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <icon
                  icon="mdi:dots-horizontal"
                  width="14"
                />
              </n-button>
            </div>
          </div>
        </div>
      </n-card>
    </div>
  </div>
</template>
