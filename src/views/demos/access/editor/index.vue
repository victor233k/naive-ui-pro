<script setup lang="ts">
import type { IDomEditor } from '@wangeditor/editor'
import { computed, ref } from 'vue'
import { ProWangEditor } from '@/components/wang-editor'

defineOptions({
  name: 'EditorDemo',
})

// 基础编辑器内容
const basicContent = ref('<p>欢迎使用 ProWangEditor 富文本编辑器！</p><p>这是一个基础的使用示例。</p>')

// 高级编辑器内容
const advancedContent = ref(`
<h2>高级编辑器示例</h2>
<p>这个编辑器展示了更多功能：</p>
<ul>
  <li>支持多种文本格式</li>
  <li>支持插入图片和链接</li>
  <li>支持表格和代码块</li>
  <li>支持自定义工具栏</li>
</ul>
<blockquote>
  <p>这是一个引用块的示例</p>
</blockquote>
`)

// 简化编辑器内容
const simpleContent = ref('<p>这是一个简化版的编辑器，只包含基本功能。</p>')

// 只读编辑器内容
const readOnlyContent = ref(`
<h3>只读编辑器示例</h3>
<p>这个编辑器处于只读模式，内容无法编辑。</p>
<p>适用于内容展示场景。</p>
`)

// 编辑器配置选项
const editorHeight = ref(400)
const isDisabled = ref(false)
const editorMode = ref<'default' | 'simple'>('default')
const editorTheme = ref<'auto' | 'light' | 'dark'>('auto')

const modeOptions = [
  { label: '默认模式', value: 'default' },
  { label: '简化模式', value: 'simple' },
]

const themeOptions = [
  { label: '跟随系统', value: 'auto' },
  { label: '明亮主题', value: 'light' },
  { label: '暗黑主题', value: 'dark' },
]

// 自定义工具栏配置
const customToolbarConfig = computed(() => ({
  excludeKeys: editorMode.value === 'simple'
    ? ['group-image', 'group-video', 'insertTable', 'codeBlock']
    : [],
}))

// 自定义编辑器配置
const customEditorConfig = computed(() => ({
  placeholder: `请输入内容... (${editorMode.value === 'default' ? '完整功能' : '简化功能'})`,
  onChange: (editor: IDomEditor) => {
    console.log('编辑器内容变化：', editor.getHtml())
  },
  onCreated: (editor: IDomEditor) => {
    console.log('编辑器创建完成：', editor)
  },
  onDestroyed: (editor: IDomEditor) => {
    console.log('编辑器销毁：', editor)
  },
}))

// 代码示例
const codeExamples = {
  basic: `<ProWangEditor 
  v-model="content" 
  placeholder="请输入内容..." 
/>`,

  advanced: `<ProWangEditor
  v-model="content"
  :height="400"
  mode="default"
  :disabled="false"
  theme="auto"
  :toolbar-config="toolbarConfig"
  :editor-config="editorConfig"
/>`,

  simple: `<ProWangEditor
  v-model="content"
  mode="simple"
  :height="300"
/>`,

  readonly: `<ProWangEditor
  v-model="content"
  :disabled="true"
/>`,
}
</script>

<template>
  <div class="p-4">
    <div class="mb-6">
      <h1 class="text-2xl font-bold mb-2">
        ProWangEditor 富文本编辑器示例
      </h1>
      <p class="text-gray-600 dark:text-gray-400">
        展示 ProWangEditor 全局组件的各种用法和配置选项
      </p>
    </div>

    <n-alert
      type="info"
      class="mb-6"
    >
      <template #header>
        使用说明
      </template>
      ProWangEditor 已注册为全局组件，可以在任何页面中直接使用。支持 v-model 双向绑定、自定义配置等功能。
    </n-alert>

    <n-tabs
      type="line"
      animated
    >
      <!-- 基础示例 -->
      <n-tab-pane
        name="basic"
        tab="基础用法"
      >
        <div class="space-y-6">
          <n-card title="基础编辑器">
            <template #header-extra>
              <n-space>
                <span class="text-sm text-gray-500">最简单的用法</span>
              </n-space>
            </template>

            <pro-wang-editor
              v-model="basicContent"
              placeholder="请输入内容..."
            />

            <n-divider />

            <div>
              <h4 class="text-sm font-medium mb-2">
                代码示例：
              </h4>
              <pre class="bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm overflow-x-auto"><code>{{ codeExamples.basic }}</code></pre>
            </div>

            <div class="mt-4">
              <h4 class="text-sm font-medium mb-2">
                当前内容：
              </h4>
              <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded border text-sm max-h-32 overflow-y-auto">
                {{ basicContent }}
              </div>
            </div>
          </n-card>
        </div>
      </n-tab-pane>

      <!-- 高级示例 -->
      <n-tab-pane
        name="advanced"
        tab="高级配置"
      >
        <div class="space-y-6">
          <n-card title="配置选项">
            <n-space>
              <div class="flex items-center space-x-2">
                <span class="text-sm">高度：</span>
                <n-input-number
                  v-model:value="editorHeight"
                  :min="200"
                  :max="800"
                  :step="50"
                  size="small"
                  style="width: 120px"
                />
                <span class="text-xs text-gray-500">px</span>
              </div>

              <div class="flex items-center space-x-2">
                <span class="text-sm">模式：</span>
                <n-select
                  v-model:value="editorMode"
                  :options="modeOptions"
                  size="small"
                  style="width: 120px"
                />
              </div>

              <div class="flex items-center space-x-2">
                <span class="text-sm">禁用：</span>
                <n-switch v-model:value="isDisabled" />
              </div>

              <div class="flex items-center space-x-2">
                <span class="text-sm">主题：</span>
                <n-select
                  v-model:value="editorTheme"
                  :options="themeOptions"
                  size="small"
                  style="width: 120px"
                />
              </div>
            </n-space>
          </n-card>

          <n-card title="高级编辑器">
            <pro-wang-editor
              v-model="advancedContent"
              :height="editorHeight"
              :mode="editorMode"
              :disabled="isDisabled"
              :theme="editorTheme"
              :toolbar-config="customToolbarConfig"
              :editor-config="customEditorConfig"
            />

            <n-divider />

            <div>
              <h4 class="text-sm font-medium mb-2">
                代码示例：
              </h4>
              <pre class="bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm overflow-x-auto"><code>{{ codeExamples.advanced }}</code></pre>
            </div>
          </n-card>
        </div>
      </n-tab-pane>

      <!-- 模式对比 -->
      <n-tab-pane
        name="modes"
        tab="模式对比"
      >
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <n-card title="默认模式">
            <template #header-extra>
              <span class="text-xs text-blue-500">功能完整</span>
            </template>

            <pro-wang-editor
              v-model="advancedContent"
              mode="default"
              :height="300"
              :theme="editorTheme"
            />
          </n-card>

          <n-card title="简化模式">
            <template #header-extra>
              <span class="text-xs text-green-500">功能精简</span>
            </template>

            <pro-wang-editor
              v-model="simpleContent"
              mode="simple"
              :height="300"
              :theme="editorTheme"
            />

            <div class="mt-4">
              <h4 class="text-sm font-medium mb-2">
                代码示例：
              </h4>
              <pre class="bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm overflow-x-auto"><code>{{ codeExamples.simple }}</code></pre>
            </div>
          </n-card>
        </div>
      </n-tab-pane>

      <!-- 特殊用例 -->
      <n-tab-pane
        name="special"
        tab="特殊用例"
      >
        <div class="space-y-6">
          <n-card title="只读编辑器">
            <template #header-extra>
              <span class="text-xs text-gray-500">内容展示</span>
            </template>

            <pro-wang-editor
              v-model="readOnlyContent"
              :disabled="true"
              :height="200"
            />

            <div class="mt-4">
              <h4 class="text-sm font-medium mb-2">
                代码示例：
              </h4>
              <pre class="bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm overflow-x-auto"><code>{{ codeExamples.readonly }}</code></pre>
            </div>
          </n-card>

          <n-card title="小尺寸编辑器">
            <template #header-extra>
              <span class="text-xs text-purple-500">紧凑布局</span>
            </template>

            <pro-wang-editor
              v-model="basicContent"
              :height="150"
              mode="simple"
              placeholder="适合评论、回复等场景..."
            />
          </n-card>
        </div>
      </n-tab-pane>

      <!-- API 文档 -->
      <n-tab-pane
        name="api"
        tab="API 文档"
      >
        <div class="space-y-6">
          <n-card title="Props 属性">
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b">
                    <th class="text-left py-2 px-3">
                      属性名
                    </th>
                    <th class="text-left py-2 px-3">
                      类型
                    </th>
                    <th class="text-left py-2 px-3">
                      默认值
                    </th>
                    <th class="text-left py-2 px-3">
                      说明
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="border-b">
                    <td class="py-2 px-3 font-mono">
                      modelValue
                    </td>
                    <td class="py-2 px-3">
                      string
                    </td>
                    <td class="py-2 px-3">
                      ''
                    </td>
                    <td class="py-2 px-3">
                      编辑器内容，支持 v-model
                    </td>
                  </tr>
                  <tr class="border-b">
                    <td class="py-2 px-3 font-mono">
                      placeholder
                    </td>
                    <td class="py-2 px-3">
                      string
                    </td>
                    <td class="py-2 px-3">
                      '请输入内容...'
                    </td>
                    <td class="py-2 px-3">
                      占位符文本
                    </td>
                  </tr>
                  <tr class="border-b">
                    <td class="py-2 px-3 font-mono">
                      height
                    </td>
                    <td class="py-2 px-3">
                      string | number
                    </td>
                    <td class="py-2 px-3">
                      '400px'
                    </td>
                    <td class="py-2 px-3">
                      编辑器高度
                    </td>
                  </tr>
                  <tr class="border-b">
                    <td class="py-2 px-3 font-mono">
                      mode
                    </td>
                    <td class="py-2 px-3">
                      'default' | 'simple'
                    </td>
                    <td class="py-2 px-3">
                      'default'
                    </td>
                    <td class="py-2 px-3">
                      编辑器模式
                    </td>
                  </tr>
                  <tr class="border-b">
                    <td class="py-2 px-3 font-mono">
                      disabled
                    </td>
                    <td class="py-2 px-3">
                      boolean
                    </td>
                    <td class="py-2 px-3">
                      false
                    </td>
                    <td class="py-2 px-3">
                      是否禁用编辑器
                    </td>
                  </tr>
                  <tr class="border-b">
                    <td class="py-2 px-3 font-mono">
                      theme
                    </td>
                    <td class="py-2 px-3">
                      'light' | 'dark' | 'auto'
                    </td>
                    <td class="py-2 px-3">
                      'auto'
                    </td>
                    <td class="py-2 px-3">
                      主题模式，auto 跟随系统
                    </td>
                  </tr>
                  <tr class="border-b">
                    <td class="py-2 px-3 font-mono">
                      toolbarConfig
                    </td>
                    <td class="py-2 px-3">
                      IToolbarConfig
                    </td>
                    <td class="py-2 px-3">
                      {}
                    </td>
                    <td class="py-2 px-3">
                      工具栏配置
                    </td>
                  </tr>
                  <tr>
                    <td class="py-2 px-3 font-mono">
                      editorConfig
                    </td>
                    <td class="py-2 px-3">
                      IEditorConfig
                    </td>
                    <td class="py-2 px-3">
                      {}
                    </td>
                    <td class="py-2 px-3">
                      编辑器配置
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </n-card>

          <n-card title="Events 事件">
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b">
                    <th class="text-left py-2 px-3">
                      事件名
                    </th>
                    <th class="text-left py-2 px-3">
                      参数
                    </th>
                    <th class="text-left py-2 px-3">
                      说明
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="py-2 px-3 font-mono">
                      update:modelValue
                    </td>
                    <td class="py-2 px-3">
                      (value: string)
                    </td>
                    <td class="py-2 px-3">
                      内容变化时触发
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </n-card>

          <n-card title="使用提示">
            <div class="space-y-3 text-sm">
              <div class="flex items-start space-x-2">
                <span class="text-blue-500 mt-1">•</span>
                <span>编辑器已注册为全局组件，无需手动导入即可使用</span>
              </div>
              <div class="flex items-start space-x-2">
                <span class="text-blue-500 mt-1">•</span>
                <span>支持 TypeScript，具有完整的类型提示</span>
              </div>
              <div class="flex items-start space-x-2">
                <span class="text-blue-500 mt-1">•</span>
                <span>组件会自动处理编辑器的创建和销毁</span>
              </div>
              <div class="flex items-start space-x-2">
                <span class="text-blue-500 mt-1">•</span>
                <span>可以通过 editorConfig 和 toolbarConfig 进行深度自定义</span>
              </div>
              <div class="flex items-start space-x-2">
                <span class="text-blue-500 mt-1">•</span>
                <span>建议在表单中使用时结合验证规则</span>
              </div>
              <div class="flex items-start space-x-2">
                <span class="text-blue-500 mt-1">•</span>
                <span>支持明亮/暗黑主题，可设置为 auto 跟随系统主题</span>
              </div>
            </div>
          </n-card>
        </div>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<style scoped>
.n-card {
  margin-bottom: 0;
}

pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}

table {
  border-collapse: collapse;
}

th,
td {
  border-color: var(--border-color);
}
</style>
