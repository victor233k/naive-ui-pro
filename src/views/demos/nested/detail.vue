<template>
  <div class="size-full flex justify-center items-center">
    <div class="text-center">
      <h1 class="text-3xl font-bold mb-4">
        {{ $t('pages.demos.nested.detailTitle') }}
      </h1>
      <p class="mb-6">
        {{ $t('pages.demos.nested.detailDescription') }}
      </p>
      <n-button @click="$router.back()">
        {{ $t('pages.demos.nested.backToList') }}
      </n-button>
    </div>
  </div>
</template>
