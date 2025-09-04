import type { AppContext, Directive, DirectiveBinding } from 'vue'
import type { LoadingBinding, LoadingOptions } from './types'
import { hyphenate } from '@vueuse/core'
import { isBoolean, isObject, isString } from 'lodash-es'
import { NSpin } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { h, ref, render, unref } from 'vue'
import Spinner from '@/components/spin/index.vue'
import { useThemeStore } from '@/store/use-theme-store'

const INSTANCE_KEY = Symbol('loadingInstance')

interface LoadingEl extends HTMLElement {
  [INSTANCE_KEY]?: LoadingInstance
}

interface LoadingInstance {
  mask: HTMLDivElement
  options: LoadingOptions
  originalOverflow: string
  originalPosition: string
}

// 全屏 loading 实例管理
let fullscreenInstance: LoadingInstance | null = null

function setPosition(el: HTMLElement) {
  const position = getComputedStyle(el).position
  if (position === 'static' || !position) {
    el.style.position = 'relative'
  }
}

function getAttributeName<K extends keyof LoadingOptions>(name: K) {
  return `element-loading-${hyphenate(name)}`
}

function parseLoadingOptions(el: LoadingEl, binding: DirectiveBinding<LoadingBinding>): LoadingOptions {
  const vm = binding.instance as Record<string, any>

  function getBindingProp<K extends keyof LoadingOptions>(key: K): LoadingOptions[K] {
    return isObject(binding.value) ? binding.value[key] : undefined
  }

  function resolveExpression(key: any) {
    // 只有当 key 是字符串且存在于 vm 中时才包装成 ref
    if (isString(key) && vm?.[key]) {
      return ref(vm[key])
    }
    return key
  }

  function getProp<K extends keyof LoadingOptions>(name: K) {
    return resolveExpression(
      getBindingProp(name) || el.getAttribute(getAttributeName(name)),
    )
  }

  const fullscreen = getBindingProp('fullscreen') ?? binding.modifiers.fullscreen

  const options: LoadingOptions = {
    text: getProp('text'),
    svg: getProp('svg'),
    size: getProp('size'),
    background: getProp('background'),
    customClass: getProp('customClass'),
    fullscreen,
    target: getBindingProp('target') ?? (fullscreen ? undefined : el),
    body: getBindingProp('body') ?? binding.modifiers.body,
    lock: getBindingProp('lock') ?? binding.modifiers.lock,
  }

  return options
}

function shouldShowLoading(binding: DirectiveBinding<LoadingBinding>): boolean {
  if (isBoolean(binding.value)) {
    return binding.value
  }

  if (isObject(binding.value)) {
    if ('loading' in binding.value) {
      return !!binding.value.loading
    }

    return Object.keys(binding.value).length > 0
  }

  return false
}

function createLoadingMask(options: LoadingOptions = {}, appContext?: AppContext): HTMLDivElement {
  const container = document.createElement('div')

  if (options.body || options.fullscreen) {
    container.className = 'fixed inset-0 flex items-center justify-center z-9999'
  }
  else {
    container.className = 'absolute inset-0 flex items-center justify-center z-50'
  }

  // 背景色设置，兼容 dark 模式
  const background = unref(options.background)
  if (background) {
    container.style.background = background
  }
  else {
    const isDark = document.documentElement.classList.contains('dark')
    container.style.background = isDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.9)'
  }

  const { primaryColor } = storeToRefs(useThemeStore())

  const svg = unref(options.svg)
  const text = unref(options.text)
  const size = options.size ?? 'medium'
  const customClass = unref(options.customClass)

  let spinVNode
  if (svg) {
    spinVNode = h(
      'span',
      {
        class: customClass,
        innerHTML: svg,
      },
    )
  }
  else {
    spinVNode = h(NSpin, {
      size,
      description: text,
      stroke: primaryColor.value,
      class: customClass,
      rotate: false,
    }, {
      icon: () => {
        return h(Spinner, { size })
      },
    })
  }

  // 补充 app 上下文
  if (appContext) {
    (spinVNode as any).appContext = appContext
  }

  render(spinVNode, container)
  return container
}

function addLoadingMask(el: LoadingEl, options: LoadingOptions, appContext?: AppContext): LoadingInstance {
  const fullscreen = unref(options.fullscreen)
  const mask = createLoadingMask(options, appContext)
  let originalOverflow = ''

  // 处理全屏模式
  if (fullscreen) {
    if (fullscreenInstance) {
      removeLoadingMask(fullscreenInstance)
    }

    document.body.appendChild(mask)

    if (options.lock) {
      originalOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
    }

    const instance: LoadingInstance = {
      mask,
      options,
      originalOverflow,
      originalPosition: '',
    }

    fullscreenInstance = instance
    return instance
  }

  // 非全屏模式
  setPosition(el)

  // 处理挂载
  let target: HTMLElement
  if (isString(options.target)) {
    target = document.querySelector<HTMLElement>(options.target) ?? document.body
  }
  else {
    target = options.target ?? el
  }

  if (options.lock) {
    originalOverflow = target.style.overflow
    target.style.overflow = 'hidden'
  }

  target.appendChild(mask)

  const instance: LoadingInstance = {
    mask,
    options,
    originalOverflow,
    originalPosition: '',
  }

  return instance
}

function removeLoadingMask(instance: LoadingInstance) {
  if (!instance)
    return

  const { mask, options, originalOverflow } = instance

  // 移除遮罩
  if (mask.parentElement) {
    mask.parentElement.style.overflow = originalOverflow
    mask.parentElement.removeChild(mask)
  }

  // 恢复滚动
  if (options.lock && originalOverflow) {
    document.body.style.overflow = originalOverflow
  }

  // 清理全屏实例
  if (options.fullscreen && fullscreenInstance === instance) {
    fullscreenInstance = null
  }
}

const loading: Directive<LoadingEl, LoadingBinding> = {
  mounted(el, binding) {
    if (shouldShowLoading(binding)) {
      const options = parseLoadingOptions(el, binding)
      const appContext = (binding.instance as any)?.$?.appContext as AppContext | undefined
      el[INSTANCE_KEY] = addLoadingMask(el, options, appContext)
    }
  },

  updated(el, binding) {
    const isShow = shouldShowLoading(binding)
    const hasInstance = !!el[INSTANCE_KEY]

    const appContext = (binding.instance as any)?.$?.appContext as AppContext | undefined

    if (isShow && !hasInstance) {
      const options = parseLoadingOptions(el, binding)
      el[INSTANCE_KEY] = addLoadingMask(el, options, appContext)
    }
    else if (isShow && hasInstance) {
      removeLoadingMask(el[INSTANCE_KEY]!)
      const options = parseLoadingOptions(el, binding)
      el[INSTANCE_KEY] = addLoadingMask(el, options, appContext)
    }
    else if (!isShow && hasInstance) {
      removeLoadingMask(el[INSTANCE_KEY]!)
      el[INSTANCE_KEY] = undefined
    }
  },

  unmounted(el) {
    if (el[INSTANCE_KEY]) {
      removeLoadingMask(el[INSTANCE_KEY]!)
      el[INSTANCE_KEY] = undefined
    }
  },
}

export { createLoadingMask, removeLoadingMask }

export default loading
