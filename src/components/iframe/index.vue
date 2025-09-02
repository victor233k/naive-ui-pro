<script setup lang="ts">
import { ref } from 'vue'

defineProps({
  url: {
    type: String,
    required: true,
  },
})

const loading = ref(true)
</script>

<template>
  <div
    v-loading="loading"
    class="size-full"
  >
    <iframe
      class="size-full border-none overflow-hidden"
      :src="url"
      @load="loading = false"
    />
  </div>
</template>
