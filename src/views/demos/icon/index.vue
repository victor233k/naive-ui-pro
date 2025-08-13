<script setup lang="ts">
import { createProForm } from 'pro-naive-ui'
import { $t } from '@/locales/locales'

const form = createProForm()
</script>

<template>
  <pro-form :form="form">
    <div class="flex flex-col gap-4">
      <pro-card
        :title="$t('pages.demos.icon.remoteSearch1')"
        :tooltip="$t('pages.demos.icon.remoteSearchTooltip1')"
        :show-collapse="false"
      >
        <pro-iconify-icons
          :title="$t('pages.demos.icon.singleIcon')"
          path="icon"
        />
        <pro-iconify-icons
          :title="$t('pages.demos.icon.multipleIcon')"
          path="icon-multiple"
          :field-props="{
            multiple: true,
          }"
        />
      </pro-card>
      <pro-card
        :title="$t('pages.demos.icon.remoteSearch2')"
        :tooltip="$t('pages.demos.icon.remoteSearchTooltip2')"
        :show-collapse="false"
      >
        <pro-iconify-icons2
          :title="$t('pages.demos.icon.singleIcon')"
          path="icon"
        />
        <pro-iconify-icons2
          :title="$t('pages.demos.icon.multipleIcon')"
          path="icon-multiple"
          :field-props="{
            multiple: true,
          }"
        />
      </pro-card>
    </div>
  </pro-form>
</template>
