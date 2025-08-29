<script setup lang="ts">
import { useMessage } from 'naive-ui'
import { shallowRef } from 'vue'
import { $t } from '@/locales/locales'
import {
  downloadBase64,
  downloadFileFromUrl,
  downloadImage,
  downloadText,
  fetchBlobResponse,
} from '@/utils/file'

const message = useMessage()

// 示例数据
const fileUrl = shallowRef('https://github.com/Zheng-Changfu/naive-ui-pro/archive/refs/heads/main.zip')
const imageUrl = shallowRef('https://unpkg.com/@lircoding/static-source@1.0.2/source/naive.svg')
const sampleText = shallowRef('这是一个示例文本文件，包含一些中文内容。')
const base64Data = shallowRef('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==')

async function handleGetBlob() {
  try {
    const response = await fetchBlobResponse<Blob>(imageUrl.value)
    message.success(`${$t('pages.demos.download.getBlobSuccess')}，${$t('pages.demos.download.blobSize')}: ${(response.data.size / 1024).toFixed(2)} KB`)
  }
  catch (error) {
    message.error($t('pages.demos.download.getBlobFailed'))
    console.error(error)
  }
}

async function handleGetResponse() {
  try {
    const response = await fetchBlobResponse(imageUrl.value)
    message.success(`${$t('pages.demos.download.getResponseSuccess')}，${$t('pages.demos.download.responseStatus')}: ${response.status}`)
  }
  catch (error) {
    message.error($t('pages.demos.download.getResponseFailed'))
    console.error(error)
  }
}
</script>

<template>
  <n-flex
    vertical
    class="gap-16px"
  >
    <n-card :title="$t('pages.demos.download.fileDownload')">
      <n-space vertical>
        <n-input
          v-model:value="fileUrl"
          :placeholder="$t('pages.demos.download.fileUrlPlaceholder')"
        />
        <n-button
          type="primary"
          @click="downloadFileFromUrl(fileUrl, 'sample.pdf')"
        >
          {{ $t('pages.demos.download.downloadFile') }}
        </n-button>
      </n-space>
    </n-card>

    <n-card :title="$t('pages.demos.download.imageDownload')">
      <n-space vertical>
        <n-input
          v-model:value="imageUrl"
          :placeholder="$t('pages.demos.download.imageUrlPlaceholder')"
        />
        <n-button
          type="primary"
          @click="downloadImage(imageUrl, 'sample-image.png')"
        >
          {{ $t('pages.demos.download.downloadImage') }}
        </n-button>
      </n-space>
    </n-card>

    <n-card :title="$t('pages.demos.download.textDownload')">
      <n-space vertical>
        <n-input
          v-model:value="sampleText"
          type="textarea"
          :placeholder="$t('pages.demos.download.textContentPlaceholder')"
          :rows="4"
        />
        <n-button
          type="primary"
          @click="downloadText(sampleText, 'sample-text.txt')"
        >
          {{ $t('pages.demos.download.downloadText') }}
        </n-button>
      </n-space>
    </n-card>

    <n-card :title="$t('pages.demos.download.base64Download')">
      <n-space vertical>
        <n-input
          v-model:value="base64Data"
          type="textarea"
          :placeholder="$t('pages.demos.download.base64DataPlaceholder')"
          :rows="3"
        />
        <n-button
          type="primary"
          @click="downloadBase64(base64Data, 'sample-image.png', 'image/png')"
        >
          {{ $t('pages.demos.download.downloadBase64') }}
        </n-button>
      </n-space>
    </n-card>

    <n-card :title="$t('pages.demos.download.requestDownload')">
      <n-space vertical>
        <n-input
          v-model:value="imageUrl"
          :placeholder="$t('pages.demos.download.requestUrlPlaceholder')"
        />
        <n-space>
          <n-button
            type="primary"
            @click="handleGetBlob"
          >
            {{ $t('pages.demos.download.getBlob') }}
          </n-button>
          <n-button
            type="primary"
            @click="handleGetResponse"
          >
            {{ $t('pages.demos.download.fetchBlobResponse') }}
          </n-button>
        </n-space>
      </n-space>
    </n-card>
  </n-flex>
</template>
