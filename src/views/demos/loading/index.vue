<script setup lang="ts">
import { NButton, NCard, NSpace } from 'naive-ui'
import { onMounted, onUnmounted, ref } from 'vue'
import { useLoading } from '@/composables/use-loading'
import { NLoading } from '@/directive/loading/service'
import { $t } from '@/locales/locales'

// Basic loading
const basicLoading = ref(false)

// Custom configuration loading
const customLoading = ref(false)

// Lock scroll loading
const lockLoading = ref(false)

// Body mount loading
const bodyLoading = ref(false)

// SVG loading
const svgLoading = ref(false)

// Active instance count
const activeInstanceCount = ref(0)

// Composable loading
const { loading: composableLoading, show, wrap } = useLoading({
  autoClose: true,
  autoCloseDelay: 2000,
  defaultOptions: {
    text: $t('pages.demos.loading.composable.composableLoading'),
    background: 'rgba(0, 0, 0, 0.7)',
  },
})
// 缩小 SVG loading 的图标尺寸
const customSvg = `
  <svg width="32" height="32" viewBox="0 0 50 50">
    <circle cx="25" cy="25" r="12" fill="none" stroke="currentColor" stroke-width="3" stroke-dasharray="18.85" stroke-dashoffset="18.85">
      <animate attributeName="stroke-dasharray" dur="2s" values="0 18.85;9.425 9.425;0 18.85" repeatCount="indefinite"/>
      <animate attributeName="stroke-dashoffset" dur="2s" values="0;-9.425;-18.85" repeatCount="indefinite"/>
    </circle>
  </svg>
`

async function testWrappedFunction() {
  const wrappedFn = wrap(
    async (message: string) => {
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log(message)
      return $t('pages.demos.loading.operationComplete')
    },
    { text: $t('pages.demos.loading.composable.wrappedFunctionExecuting') },
  )

  const result = await wrappedFn($t('pages.demos.loading.testMessage'))
  console.log($t('pages.demos.loading.result'), result)
}

// 更新活跃实例数量
function updateInstanceCount() {
  activeInstanceCount.value = NLoading.getInstanceCount()
}

let intervalId: NodeJS.Timeout

onMounted(() => {
  intervalId = setInterval(updateInstanceCount, 100)
})

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})
</script>

<template>
  <n-space
    vertical
    size="large"
  >
    <!-- Basic Usage -->
    <n-card
      :title="$t('pages.demos.loading.basicUsage.title')"
      size="small"
    >
      <n-space vertical>
        <div
          v-loading="basicLoading"
          class="loading-container"
        >
          <p>{{ $t('pages.demos.loading.basicUsage.description') }}</p>
          <p>{{ $t('pages.demos.loading.basicUsage.description2') }}</p>
        </div>
        <n-button @click="basicLoading = !basicLoading">
          {{ basicLoading ? $t('pages.demos.loading.basicUsage.hideButton') : $t('pages.demos.loading.basicUsage.showButton') }}
        </n-button>
      </n-space>
    </n-card>

    <!-- Custom Text and Background -->
    <n-card
      :title="$t('pages.demos.loading.customConfig.title')"
      size="small"
    >
      <n-space vertical>
        <div
          v-loading="customLoading"
          class="loading-container"
          :element-loading-text="$t('pages.demos.loading.customLoading')"
          element-loading-background="rgba(0, 0, 0, 0.6)"
          element-loading-custom-class="custom-loading"
        >
          <p>{{ $t('pages.demos.loading.customConfig.description') }}</p>
        </div>
        <n-button @click="customLoading = !customLoading">
          {{ customLoading ? $t('pages.demos.loading.customConfig.hideButton') : $t('pages.demos.loading.customConfig.showButton') }}
        </n-button>
      </n-space>
    </n-card>

    <!-- Modifier Usage -->
    <n-card
      :title="$t('pages.demos.loading.modifiers.title')"
      size="small"
    >
      <n-space vertical>
        <div v-loading.lock="lockLoading">
          <div class="loading-container">
            <p>{{ $t('pages.demos.loading.modifiers.description') }}</p>
            <p>{{ $t('pages.demos.loading.modifiers.description2') }}</p>
            <p>{{ $t('pages.demos.loading.modifiers.description2') }}</p>
            <p>{{ $t('pages.demos.loading.modifiers.description2') }}</p>
            <p>{{ $t('pages.demos.loading.modifiers.description2') }}</p>
            <p>{{ $t('pages.demos.loading.modifiers.description2') }}</p>
          </div>
        </div>
        <n-button @click="lockLoading = !lockLoading">
          {{ lockLoading ? $t('pages.demos.loading.modifiers.hideButton') : $t('pages.demos.loading.modifiers.showButton') }}
        </n-button>
      </n-space>
    </n-card>

    <!-- Body Mount -->
    <n-card
      :title="$t('pages.demos.loading.bodyMount.title')"
      size="small"
    >
      <n-space vertical>
        <div
          v-loading.body.lock="bodyLoading"
          element-loading-size="large"
          class="loading-container"
        >
          <p>{{ $t('pages.demos.loading.bodyMount.description') }}</p>
          <p>{{ $t('pages.demos.loading.bodyMount.description2') }}</p>
        </div>
        <n-button @click="bodyLoading = !bodyLoading">
          {{ bodyLoading ? $t('pages.demos.loading.bodyMount.hideButton') : $t('pages.demos.loading.bodyMount.showButton') }}
        </n-button>
      </n-space>
    </n-card>

    <!-- Custom SVG -->
    <n-card
      :title="$t('pages.demos.loading.customSvg.title')"
      size="small"
    >
      <n-space vertical>
        <div
          v-loading="{
            loading: svgLoading,
            svg: customSvg,
            text: $t('pages.demos.loading.customSvg.loadingText'),
            background: 'rgba(255, 255, 255, 0.9)',
          }"
          class="loading-container"
        >
          <p>{{ $t('pages.demos.loading.customSvg.description') }}</p>
        </div>
        <n-button @click="svgLoading = !svgLoading">
          {{ svgLoading ? $t('pages.demos.loading.customSvg.hideButton') : $t('pages.demos.loading.customSvg.showButton') }}
        </n-button>
      </n-space>
    </n-card>

    <!-- Composable Usage -->
    <n-card
      :title="$t('pages.demos.loading.composable.title')"
      size="small"
    >
      <n-space vertical>
        <p>{{ $t('pages.demos.loading.composable.description') }}</p>
        <n-space>
          <n-button @click="show()">
            {{ $t('pages.demos.loading.composable.showButton') }}
          </n-button>
          <n-button @click="testWrappedFunction">
            {{ $t('pages.demos.loading.composable.testButton') }}
          </n-button>
        </n-space>
        <p>{{ $t('pages.demos.loading.composable.status') }}: {{ composableLoading ? $t('pages.demos.loading.composable.showing') : $t('pages.demos.loading.composable.hidden') }}</p>
      </n-space>
    </n-card>
  </n-space>
</template>

<style>
.loading-container {
  min-height: 50px;
  max-height: 80px;
  overflow: auto;
  padding: 20px;
  border: 1px solid var(--n-border-color);
  border-radius: var(--n-border-radius);
  background: var(--n-color);
  position: relative;
}
.dark .loading-container {
  background: #232324;
  border-color: #232324;
}
</style>
