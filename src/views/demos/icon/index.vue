<script setup lang="ts">
import { createProForm } from 'pro-naive-ui'

const form = createProForm()
</script>

<template>
  <pro-form :form="form">
    <div class="flex flex-col gap-4">
      <pro-card
        title="远程搜索-风格1"
        tooltip="回显时远程搜索 options"
        :show-collapse="false"
      >
        <pro-iconify-icons
          title="单选图标"
          path="icon"
        />
        <pro-iconify-icons
          title="多选图标"
          path="icon-multiple"
          :field-props="{
            multiple: true,
          }"
        />
      </pro-card>
      <pro-card
        title="远程搜索-风格2"
        tooltip="回显时合并 options"
        :show-collapse="false"
      >
        <pro-iconify-icons2
          title="单选图标"
          path="icon"
        />
        <pro-iconify-icons2
          title="多选图标"
          path="icon-multiple"
          :field-props="{
            multiple: true,
          }"
        />
      </pro-card>
    </div>
  </pro-form>
</template>
