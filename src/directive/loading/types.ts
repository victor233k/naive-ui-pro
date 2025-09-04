import type { MaybeRef } from '@vueuse/core'
import type { UnwrapRef } from 'vue'

export interface LoadingOptions {
  /**
   * 是否显示 loading
   */
  loading?: boolean
  /**
   * 遮罩层颜色
   */
  background?: MaybeRef<string>
  /**
   * 自定义图标
   */
  svg?: MaybeRef<string>
  /**
   * 文字描述
   */
  text?: MaybeRef<string>
  /**
   * 全屏修饰符
   */
  fullscreen?: boolean
  /**
   * 锁定滚动修饰符
   */
  lock?: boolean
  /**
   * loading 大小
   */
  size?: 'small' | 'medium' | 'large' | number
  /**
   * 给loading加的类名
   */
  customClass?: MaybeRef<string>
  /**
   * 目标元素
   */
  target?: HTMLElement | string
  /**
   * 在body上展示的修饰符
   */
  body?: boolean
}

export type LoadingBinding = boolean | UnwrapRef<LoadingOptions>
