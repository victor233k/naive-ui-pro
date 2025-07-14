<script setup lang="ts">
import { useDialog, useMessage } from 'naive-ui'
import { onBeforeRouteLeave, useRouter } from 'vue-router'

defineOptions({ name: 'BasicInfo' })

const router = useRouter()
const dialog = useDialog()
const message = useMessage()

function submit() {
  router.disableLeaveGuard()
  router.push({ name: 'basic-list' })
}

// router.enableLeaveGuard(handleConfirm)
onBeforeRouteLeave(() => {
  return handleConfirm()
})

function handleConfirm() {
  return new Promise<boolean>((resolve) => {
    dialog.warning({
      title: '警告',
      content: '你确定？',
      positiveText: '确定',
      negativeText: '不确定',
      draggable: true,
      onPositiveClick: () => {
        message.success('确定')
        resolve(true)
      },
      onNegativeClick: () => {
        message.error('不确定')
        resolve(false)
      },
    })
  })
}
</script>

<template>
  <div>
    当前页面: base-info
    <n-button @click="$router.enableLeaveGuard()">
      添加离开提示
    </n-button>
    <n-button @click="submit">
      提交数据
    </n-button>
    <n-button @click="$router.go(-1)">
      返回
    </n-button>
  </div>
</template>
