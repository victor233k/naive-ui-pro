<script setup lang="ts">
import type { IDomEditor, Toolbar } from '@wangeditor/editor'
import type { ProWangEditorProps } from './interface'
import { createEditor, createToolbar } from '@wangeditor/editor'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import { useThemeStore } from '@/store/use-theme-store'
import '@wangeditor/editor/dist/css/style.css'

defineOptions({
  name: 'ProWangEditor',
})

const props = withDefaults(defineProps<ProWangEditorProps>(), {
  modelValue: '',
  placeholder: '请输入内容...',
  height: '400px',
  mode: 'default',
  disabled: false,
  theme: 'auto',
  toolbarConfig: () => ({}),
  editorConfig: () => ({}),
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

// 主题相关
const themeStore = useThemeStore()

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef<IDomEditor>()
const toolbarRef = shallowRef<Toolbar>()
const editorContainer = ref<HTMLDivElement>()
const toolbarContainer = ref<HTMLDivElement>()

// 计算当前是否为暗黑主题
const isDarkTheme = computed(() => {
  if (props.theme === 'dark')
    return true
  if (props.theme === 'light')
    return false
  return themeStore.isDark // auto 模式跟随系统
})

// 计算样式
const editorStyle = computed(() => ({
  height: typeof props.height === 'number' ? `${props.height}px` : props.height,
}))

// 编辑器配置
const mergedEditorConfig = computed(() => Object.assign({
  placeholder: props.placeholder,
  readOnly: props.disabled,
}, props.editorConfig, {
  onChange(editor: IDomEditor) {
    const html = editor.getHtml()
    emit('update:modelValue', html)
    props.editorConfig?.onChange?.(editor)
  },
}))

// 工具栏配置
const mergedToolbarConfig = computed(() => Object.assign({}, props.toolbarConfig))

// 创建编辑器的函数
function createEditorInstance() {
  if (!toolbarContainer.value || !editorContainer.value) {
    return
  }

  // 销毁旧的编辑器
  if (editorRef.value) {
    editorRef.value.destroy()
    editorRef.value = undefined
  }
  if (toolbarRef.value) {
    toolbarRef.value.destroy()
    toolbarRef.value = undefined
  }

  // 创建新编辑器
  const editor = createEditor({
    selector: editorContainer.value,
    html: props.modelValue,
    config: mergedEditorConfig.value,
    mode: props.mode,
  })
  editorRef.value = editor

  // 创建新工具栏
  const toolbar = createToolbar({
    editor: editorRef.value,
    selector: toolbarContainer.value,
    config: mergedToolbarConfig.value,
    mode: props.mode,
  })
  toolbarRef.value = toolbar
}

// 监听 modelValue 变化
watch(() => props.modelValue, (newValue) => {
  const editor = editorRef.value
  if (editor && editor.getHtml() !== newValue) {
    editor.setHtml(newValue || '')
  }
})

// 防抖重建编辑器
let rebuildTimer: ReturnType<typeof setTimeout> | null = null
function debounceRebuild() {
  if (rebuildTimer) {
    clearTimeout(rebuildTimer)
  }
  rebuildTimer = setTimeout(() => {
    nextTick(() => {
      createEditorInstance()
    })
  }, 100)
}

// 监听影响编辑器配置的 props 变化
watch(
  () => [props.mode, props.disabled, props.placeholder],
  debounceRebuild,
  { deep: true },
)

// 监听工具栏和编辑器配置变化
watch(
  () => [props.toolbarConfig, props.editorConfig],
  debounceRebuild,
  { deep: true },
)

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  // 清理定时器
  if (rebuildTimer) {
    clearTimeout(rebuildTimer)
    rebuildTimer = null
  }

  editorRef.value?.destroy()
  toolbarRef.value?.destroy()
})

onMounted(() => {
  createEditorInstance()
})
</script>

<template>
  <div
    class="wang-editor"
    :class="{
      'wang-editor--disabled': props.disabled,
      'wang-editor--dark': isDarkTheme,
    }"
  >
    <!-- 工具栏 -->
    <div
      ref="toolbarContainer"
      class="toolbar-container"
    />
    <!-- 编辑器 -->
    <div
      ref="editorContainer"
      class="editor-container"
      :style="editorStyle"
    />
  </div>
</template>

<style scoped>
/* 使用 WangEditor 官方 CSS 变量系统 */
.wang-editor {
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  transition: all 0.2s;

  &.w-e-full-screen-container {
    /* 全屏模式下，需要设置 z-index 至少为 1000，否则无法覆盖布局顶栏 */
    z-index: 1000;
  }
}

/* 暗黑主题 - 覆盖 WangEditor 的 CSS 变量 */
.wang-editor--dark {
  /* 编辑区域变量 */
  --w-e-textarea-bg-color: #1f1f1f;
  --w-e-textarea-color: #ffffff;
  --w-e-textarea-border-color: #424242;
  --w-e-textarea-slight-border-color: #424242;
  --w-e-textarea-slight-color: #8c8c8c;
  --w-e-textarea-slight-bg-color: #2c2c2c;
  --w-e-textarea-selected-border-color: #1890ff;
  --w-e-textarea-handler-bg-color: #1890ff;

  /* 工具栏变量 */
  --w-e-toolbar-color: #d9d9d9;
  --w-e-toolbar-bg-color: #2c2c2c;
  --w-e-toolbar-active-color: #ffffff;
  --w-e-toolbar-active-bg-color: #424242;
  --w-e-toolbar-disabled-color: #666666;
  --w-e-toolbar-border-color: #424242;

  /* 模态框变量 */
  --w-e-modal-button-bg-color: #363636;
  --w-e-modal-button-border-color: #424242;

  /* 组件边框 */
  border-color: #424242;
}

.wang-editor--disabled {
  opacity: 0.6;
  pointer-events: none;
}

.toolbar-container {
  transition: all 0.2s;
}

.editor-container {
  overflow-y: hidden;
  transition: all 0.2s;
}
</style>
