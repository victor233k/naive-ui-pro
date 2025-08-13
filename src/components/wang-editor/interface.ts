import type { IEditorConfig, IToolbarConfig } from '@wangeditor/editor'

export interface ProWangEditorProps {
  /** 编辑器初始内容 */
  modelValue?: string
  /** 编辑器占位符 */
  placeholder?: string
  /** 编辑器高度 */
  height?: string | number
  /** 编辑器模式 'default' | 'simple' */
  mode?: 'default' | 'simple'
  /** 是否禁用 */
  disabled?: boolean
  /** 主题模式 'light' | 'dark' | 'auto' */
  theme?: 'light' | 'dark' | 'auto'
  /** 工具栏配置 */
  toolbarConfig?: Partial<IToolbarConfig>
  /** 编辑器配置 */
  editorConfig?: Partial<IEditorConfig>
}
