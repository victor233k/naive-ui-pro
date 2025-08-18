<script setup lang="ts">
import { useMessage } from 'naive-ui'
import { shallowRef } from 'vue'
import {
  downloadBase64,
  downloadFileFromUrl,
  downloadImage,
  downloadText,
  getBlob,
  getResponse,
} from './utils/download'

const message = useMessage()

// 示例数据
const fileUrl = shallowRef('https://github.com/Zheng-Changfu/naive-ui-pro/archive/refs/heads/main.zip')
const imageUrl = shallowRef('https://unpkg.com/@lircoding/static-source@1.0.2/source/naive.svg')
const sampleText = shallowRef('这是一个示例文本文件，包含一些中文内容。\nThis is a sample text file with some Chinese content.')
const base64Data = shallowRef('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==')

// 下载文件
async function handleDownloadFile() {
  try {
    await downloadFileFromUrl(fileUrl.value, 'sample.pdf')
    message.success('文件下载成功')
  }
  catch (error) {
    message.error('文件下载失败')
    console.error(error)
  }
}

// 下载图片
async function handleDownloadImage() {
  try {
    await downloadImage(imageUrl.value, 'sample-image.png')
    message.success('图片下载成功')
  }
  catch (error) {
    message.error('图片下载失败')
    console.error(error)
  }
}

// 下载文本
function handleDownloadText() {
  try {
    downloadText(sampleText.value, 'sample-text.txt')
    message.success('文本下载成功')
  }
  catch (error) {
    message.error('文本下载失败')
    console.error(error)
  }
}

// 下载base64数据
function handleDownloadBase64() {
  try {
    downloadBase64(base64Data.value, 'sample-image.png', 'image/png')
    message.success('base64数据下载成功')
  }
  catch (error) {
    message.error('base64数据下载失败')
    console.error(error)
  }
}

// 获取Blob
async function handleGetBlob() {
  try {
    const blob = await getBlob(imageUrl.value)
    message.success(`获取Blob成功，大小: ${(blob.size / 1024).toFixed(2)} KB`)
    console.log('Blob对象:', blob)
  }
  catch (error) {
    message.error('获取Blob失败')
    console.error(error)
  }
}

// 获取Response
async function handleGetResponse() {
  try {
    const response = await getResponse(imageUrl.value)
    message.success(`获取Response成功，状态: ${response.status}`)
  }
  catch (error) {
    message.error('获取Response失败')
    console.error(error)
  }
}
</script>

<template>
  <n-flex
    vertical
    class="gap-16px"
  >
    <n-card title="根据文件地址下载文件">
      <n-space vertical>
        <n-input
          v-model:value="fileUrl"
          placeholder="请输入文件URL"
        />
        <n-button
          type="primary"
          @click="handleDownloadFile"
        >
          下载文件
        </n-button>
      </n-space>
    </n-card>

    <n-card title="根据地址下载图片">
      <n-space vertical>
        <n-input
          v-model:value="imageUrl"
          placeholder="请输入图片URL"
        />
        <n-button
          type="primary"
          @click="handleDownloadImage"
        >
          下载图片
        </n-button>
      </n-space>
    </n-card>

    <n-card title="文本下载">
      <n-space vertical>
        <n-input
          v-model:value="sampleText"
          type="textarea"
          placeholder="请输入要下载的文本内容"
          :rows="4"
        />
        <n-button
          type="primary"
          @click="handleDownloadText"
        >
          下载文本
        </n-button>
      </n-space>
    </n-card>

    <n-card title="base64流下载">
      <n-space vertical>
        <n-input
          v-model:value="base64Data"
          type="textarea"
          placeholder="请输入base64数据"
          :rows="3"
        />
        <n-button
          type="primary"
          @click="handleDownloadBase64"
        >
          下载base64数据
        </n-button>
      </n-space>
    </n-card>

    <n-card title="请求下载">
      <n-space vertical>
        <n-input
          v-model:value="imageUrl"
          placeholder="请输入请求URL"
        />
        <n-space>
          <n-button
            type="info"
            @click="handleGetBlob"
          >
            获取Blob
          </n-button>
          <n-button
            type="info"
            @click="handleGetResponse"
          >
            获取Response
          </n-button>
        </n-space>
      </n-space>
    </n-card>
  </n-flex>
</template>
