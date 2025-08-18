<template>
  <div class="size-full flex justify-center items-center">
    <div class="text-center">
      <h2 class="text-2xl font-bold mb-4">
        {{ $t('pages.demos.nested.title') }}
      </h2>
      <p class="mb-6">
        {{ $t('pages.demos.nested.description') }}
      </p>
      <n-button
        type="primary"
        size="large"
        @click="$router.push('/demos/nested-detail/detail')"
      >
        {{ $t('pages.demos.nested.goToDetail') }}
      </n-button>
    </div>
  </div>
</template>
