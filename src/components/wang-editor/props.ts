import type { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor'
import type { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import type { MaybeArray } from 'naive-ui/es/_utils'
import type { BaseFieldProps } from 'pro-naive-ui'
import type { ExtractPublicPropTypes, PropType } from 'vue'
import { proFieldSharedProps } from 'pro-naive-ui'

export const wangEditorProps = {
  /**
   * 用于双向绑定
   */
  'modelValue': String,
  /**
   * 占位符
   */
  'placeholder': String,
  /**
   * 是否禁用
   */
  'disabled': {
    type: Boolean,
    default: undefined,
  },
  /**
   * 编辑器高度
   */
  'height': {
    type: String,
    default: '300px',
  },
  /**
   * 验证状态，可以脱离表单使用
   */
  'status': String as PropType<'success' | 'error' | 'warning'>,
  /**
   * 编辑器配置
   */
  'editorConfig': Object as PropType<Partial<IEditorConfig>>,
  /**
   * 工具栏配置
   */
  'toolbarConfig': Object as PropType<Partial<IToolbarConfig>>,
  /**
   * 用于双向绑定
   */
  'onUpdate:modelValue': [Function, Array] as PropType<MaybeArray<(value: string) => void>>,
  /**
   * 用于双向绑定
   */
  'onUpdateModelValue': [Function, Array] as PropType<MaybeArray<(value: string) => void>>,
  // #region
  // 事件透传给编辑器
  'onOnBlur': Function as PropType<(editor: IDomEditor) => void>,
  'onOnFocus': Function as PropType<(editor: IDomEditor) => void>,
  'onOnChange': Function as PropType<(editor: IDomEditor) => void>,
  'onOnCreated': Function as PropType<(editor: IDomEditor) => void>,
  'onOnDestroyed': Function as PropType<(editor: IDomEditor) => void>,
  'onOnMaxLength': Function as PropType<(editor: IDomEditor) => void>,
  'onCustomAlert': Function as PropType<(editor: IDomEditor) => void>,
  // #endregion
} as const

export const proWangEditorProps = {
  ...proFieldSharedProps,
  valueModelName: {
    type: String,
    default: 'modelValue',
  },
  fieldProps: Object as PropType<BaseFieldProps<WangEditorProps>>,
} as const

export type EditorProps = InstanceType<typeof Editor>['$props']
export type ToolbarProps = InstanceType<typeof Toolbar>['$props']
export type WangEditorProps = ExtractPublicPropTypes<typeof wangEditorProps>
export type ProWangEditorProps = ExtractPublicPropTypes<typeof proWangEditorProps>
