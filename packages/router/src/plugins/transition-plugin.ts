import type { ComputedRef, Ref, TransitionProps } from 'vue'
import type { ProRouterPlugin } from '../plugin'
import { computed, ref } from 'vue'

declare module 'vue-router' {
  interface Router {
    transitionProps: ComputedRef<TransitionProps>
    transitionName: Ref<NonNullable<TransitionPluginOptions['defaultTransitionName']>>
    transitionNameToTransitionPropsRecord: NonNullable<TransitionPluginOptions['transitionNameToTransitionPropsRecord']>
  }
}

export type RouteTransitionName
= | 'fade'
  | 'fade-down'
  | 'fade-slide'
  | 'fade-up'
  | (string & {})

/**
 * 路由过渡插件
 */

interface TransitionPluginOptions {
  /**
   * 默认过渡名称
   * @default 'fade'
   */
  defaultTransitionName?: RouteTransitionName
  /**
   * 过渡名称到 transition 的 props 的映射
   */
  transitionNameToTransitionPropsRecord?: Partial<Record<RouteTransitionName, TransitionProps>>
}

// TODO
const builtinTransitionNameToTransitionPropsRecord: TransitionPluginOptions['transitionNameToTransitionPropsRecord'] = {
  // 'fade': {
  //   enterActiveClass: 'transition-all duration-300 ease-in-out',
  //   enterFromClass: 'opacity-0',
  //   enterToClass: 'opacity-100',
  //   leaveActiveClass: 'transition-all duration-300 ease-in-out',
  //   leaveFromClass: 'opacity-100',
  //   leaveToClass: 'opacity-0',
  // },
  // 'fade-up': {
  //   enterActiveClass: 'transition-all duration-300 ease-in-out',
  //   enterFromClass: 'opacity-0 translate-y-40px',
  //   enterToClass: 'opacity-100 translate-y-0',
  //   leaveActiveClass: 'transition-all duration-300 ease-in-out',
  //   leaveFromClass: 'opacity-100 translate-y-0',
  //   leaveToClass: 'opacity-0 translate-y-40px',
  // },
  'fade-down': {
    enterActiveClass: 'transition-all duration-300 ease-in-out',
    enterFromClass: 'opacity-0 translate-y-400px bg-red',
    enterToClass: 'opacity-100 translate-y-0 bg-red-500',
    leaveActiveClass: 'transition-all duration-300 ease-in-out',
    leaveFromClass: 'opacity-100 translate-y-0',
    leaveToClass: 'opacity-0 translate-y-400px',
  },
  // 'fade-slide': {
  //   enterActiveClass: 'transition-all duration-300 ease-in-out',
  //   enterFromClass: 'opacity-0 translate-x-40px',
  //   enterToClass: 'opacity-100 translate-x-0',
  //   leaveActiveClass: 'transition-all duration-300 ease-in-out',
  //   leaveFromClass: 'opacity-100 translate-x-0',
  //   leaveToClass: 'opacity-0 translate-x-40px',
  // },
}

export function transitionPlugin({
  defaultTransitionName = 'fade',
  transitionNameToTransitionPropsRecord = builtinTransitionNameToTransitionPropsRecord,
}: TransitionPluginOptions = {}): ProRouterPlugin {
  return ({ router }) => {
    if (!router.transitionName) {
      router.transitionName = ref(defaultTransitionName)
    }
    if (!router.transitionNameToTransitionPropsRecord) {
      router.transitionNameToTransitionPropsRecord = transitionNameToTransitionPropsRecord
    }
    if (!router.transitionProps) {
      router.transitionProps = computed(() => {
        const props = transitionNameToTransitionPropsRecord[router.transitionName.value]
        if (!props) {
          if (__DEV__) {
            console.warn(`[ProRouter] transition name ${router.transitionName.value} is not found, fallback to default transition name ${defaultTransitionName}`)
          }
          return {
            ...transitionNameToTransitionPropsRecord[defaultTransitionName],
            appear: true,
            mode: 'out-in',
          }
        }
        return {
          ...props,
          appear: true,
          mode: 'out-in',
        }
      })
    }
  }
}
