import type { MaybeRef } from '@vueuse/core'
import type { UnwrapRef } from 'vue'

export interface LoadingOptions {
  /**
   * @description 是否显示 loading
   */
  loading?: boolean
  /**
   * @description 遮罩层颜色
   */
  background?: MaybeRef<string>
  /**
   * @description 自定义图标
   */
  svg?: MaybeRef<string>
  /**
   * @description 文字描述
   */
  text?: MaybeRef<string>
  /**
   * @description 全屏修饰符
   */
  fullscreen?: boolean
  /**
   * @description 锁定滚动修饰符
   */
  lock?: boolean
  /**
   * @description 给loading加的类名
   */
  customClass?: MaybeRef<string>
  /**
   * @description 目标元素
   */
  target?: HTMLElement
  /**
   * @description 在body上展示的修饰符
   */
  body?: boolean
}

export type LoadingBinding = boolean | UnwrapRef<LoadingOptions>
