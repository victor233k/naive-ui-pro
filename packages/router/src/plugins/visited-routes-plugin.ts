import type { WritableComputedRef } from 'vue'
import type { RouteLocationNormalized } from 'vue-router'
import type { ProRouterPlugin } from '../plugin'
import { tryOnScopeDispose } from '@vueuse/core'
import { move as _move } from 'pro-composables'
import { computed, ref } from 'vue'
import { warn } from '../utils/warn'

declare module 'vue-router' {
  interface Router {
    visitedRoutesPlugin: {
      /**
       * 访问过的路由记录
       */
      routes: RouteLocationNormalized[]
      /**
       * 当前激活的路由索引
       */
      activeIndex: WritableComputedRef<number>
      /**
       * 添加路由
       * @param route 要添加的路由
       * @returns 添加成功返回 true，否则返回 false
       */
      add: (route: RouteLocationNormalized) => Promise<boolean>
      /**
       * 移除指定索引的路由
       * @param index 要移除的路由索引
       * @returns 移除成功返回 true，否则返回 false
       */
      remove: (index: number) => Promise<boolean>
      /**
       * 移除指定索引范围的路由，包含起始索引，不包含结束索引
       * @param from 起始索引
       * @param to 结束索引
       */
      removes: (from: number, to: number) => Promise<void>
      /**
       * 移动指定索引的路由到另一个位置
       * @param from 原始索引
       * @param to 目标索引
       * @returns 移动成功返回 true，否则返回 false
       */
      move: (from: number, to: number) => Promise<boolean>
      /**
       * 操作拦截守卫
       */
      guards: Required<Interceptor>
    }
  }
}

type MaybePromise<T> = T | Promise<T>

interface Interceptor {
  /**
   * 在添加路由之前执行
   */
  beforeAdd?: (callback: (route: RouteLocationNormalized) => MaybePromise<RouteLocationNormalized | false> | void) => () => void
  /**
   * 在添加路由之后执行
   */
  afterAdd?: (callback: (route: RouteLocationNormalized) => MaybePromise<void>) => () => void
  /**
   * 在移除路由之前执行
   */
  beforeRemove?: (callback: (index: number) => MaybePromise<number | false> | void) => () => void
  /**
   * 在移除路由之后执行
   */
  afterRemove?: (callback: (index: number) => MaybePromise<void>) => () => void
  /**
   * 在移动路由之前执行
   */
  beforeMove?: (callback: ([from, to]: [number, number]) => MaybePromise<[number, number] | false> | void) => () => void
  /**
   * 在移动路由之后执行
   */
  afterMove?: (callback: ([from, to]: [number, number]) => MaybePromise<void>) => () => void
}

type InterceptorParams<T> = T extends (arg: infer P) => any ? P : never
type InterceptorReturn<T> = T extends (arg: any) => infer R ? R : never
type ExtractInterceptor<T> = T extends (cb: infer Fn) => any ? Fn : never

class InterceptorStore {
  private interceptorsRecord: {
    [K in keyof Interceptor]: Set<ExtractInterceptor<NonNullable<Interceptor[K]>>>
  }

  constructor() {
    this.interceptorsRecord = {
      beforeAdd: new Set(),
      afterAdd: new Set(),
      beforeRemove: new Set(),
      afterRemove: new Set(),
      beforeMove: new Set(),
      afterMove: new Set(),
    }
  }

  on = <T extends keyof Interceptor>(
    interceptorName: T,
    callback: ExtractInterceptor<NonNullable<Interceptor[T]>>,
  ) => {
    this.interceptorsRecord[interceptorName].add(callback)
    const off = () => {
      this.interceptorsRecord[interceptorName].delete(callback)
    }
    tryOnScopeDispose(off)
    return off
  }

  run = async <T extends keyof Interceptor>(
    interceptorName: T,
    params: InterceptorParams<ExtractInterceptor<NonNullable<Interceptor[T]>>>,
  ): Promise<Awaited<InterceptorReturn<ExtractInterceptor<NonNullable<Interceptor[T]>>>>> => {
    const interceptors = Array.from(this.interceptorsRecord[interceptorName])
    let currentResult: any = params
    for (let i = 0; i < interceptors.length; i++) {
      const result = await interceptors[i](currentResult)
      if (result === false) {
        return false as any
      }
      if (result !== undefined) {
        currentResult = result
      }
    }
    return currentResult
  }

  clear = () => {
    for (const key in this.interceptorsRecord) {
      this.interceptorsRecord[key as keyof Interceptor].clear()
    }
  }
}

export function visitedRoutesPlugin(): ProRouterPlugin {
  return ({ router, onUnmount }) => {
    const activeIndex = ref(-1)
    const interceptorStore = new InterceptorStore()
    const visitedRoutes = ref<RouteLocationNormalized[]>([])

    async function add(route: RouteLocationNormalized) {
      const result = await interceptorStore.run('beforeAdd', route)
      const successed = result !== false
      if (successed) {
        const i = visitedRoutes.value.findIndex(item => isEqualRoute(item as RouteLocationNormalized, result || route))
        if (~i) {
          return false
        }
        visitedRoutes.value.push(result || route)
        await interceptorStore.run('afterAdd', result || route)
      }
      return successed
    }

    async function move(from: number, to: number) {
      if (from < 0 || to < 0 || to >= visitedRoutes.value.length || from >= visitedRoutes.value.length) {
        if (__DEV__) {
          warn(`from or to is out of range, from: ${from}, to: ${to}, length: ${visitedRoutes.value.length}`)
        }
        return false
      }
      if (from === to) {
        return false
      }
      const result = await interceptorStore.run('beforeMove', [from, to])
      const successed = result !== false
      if (successed) {
        _move(visitedRoutes.value, result[0] ?? from, result[1] ?? to)
        await interceptorStore.run('afterMove', result || [from, to])
      }
      return successed
    }

    async function remove(index: number) {
      if (index < 0 || index > visitedRoutes.value.length - 1) {
        if (__DEV__) {
          warn(`index is out of range, index: ${index}, length: ${visitedRoutes.value.length}`)
        }
        return false
      }
      const result = await interceptorStore.run('beforeRemove', index)
      const successed = result !== false
      if (successed) {
        visitedRoutes.value.splice(result || index, 1)
        await interceptorStore.run('afterRemove', result || index)
      }
      return successed
    }

    async function removes(from: number, to: number) {
      if (from < 0 || to < 0 || from > to || to > visitedRoutes.value.length || from > visitedRoutes.value.length) {
        if (__DEV__) {
          warn(`from or to is out of range, from: ${from}, to: ${to}, length: ${visitedRoutes.value.length}`)
        }
        return
      }
      let i = to - 1
      let deleteCount = to - from
      const promises: Promise<boolean>[] = []
      while (deleteCount > 0) {
        promises.push(remove(i))
        i--
        deleteCount--
      }
      return Promise.all(promises).then(() => undefined)
    }

    function setActiveIndex(index: number) {
      if (index < 0 || index > visitedRoutes.value.length - 1) {
        if (__DEV__) {
          warn(`index is out of range, index: ${index}, length: ${visitedRoutes.value.length}`)
        }
        return
      }
      activeIndex.value = index
    }

    interceptorStore.on('beforeAdd', (route) => {
      const i = visitedRoutes.value.findIndex(item => isEqualRoute(item as RouteLocationNormalized, route))
      if (~i) {
        activeIndex.value = i
      }
      return route
    })

    interceptorStore.on('afterAdd', () => {
      const idx = visitedRoutes.value.findIndex(item => isEqualRoute(item as RouteLocationNormalized, router.currentRoute.value))
      if (~idx)
        activeIndex.value = idx
    })

    interceptorStore.on('afterRemove', (removedIndex) => {
      const i = activeIndex.value
      if (removedIndex < i || (removedIndex === i && i === visitedRoutes.value.length)) {
        activeIndex.value--
      }
    })

    interceptorStore.on('afterMove', () => {
      const idx = visitedRoutes.value.findIndex(item => isEqualRoute(item as RouteLocationNormalized, router.currentRoute.value))
      if (~idx)
        activeIndex.value = idx
    })

    router.afterEach((to) => {
      const invalidRoute = to.matched.length === 0
      if (!invalidRoute) {
        add(to)
      }
    })

    router.visitedRoutesPlugin = {
      routes: visitedRoutes.value as RouteLocationNormalized[],
      activeIndex: computed({
        get() {
          return activeIndex.value
        },
        set(index) {
          if (index < 0 || index > visitedRoutes.value.length - 1) {
            if (__DEV__) {
              warn(`index is out of range, index: ${index}, length: ${visitedRoutes.value.length}`)
            }
            return
          }
          setActiveIndex(index)
        },
      }),
      add,
      move,
      remove,
      removes,
      guards: {
        beforeAdd: (callback) => {
          return interceptorStore.on('beforeAdd', callback)
        },
        afterAdd: (callback) => {
          return interceptorStore.on('afterAdd', callback)
        },
        beforeRemove: (callback) => {
          return interceptorStore.on('beforeRemove', callback)
        },
        afterRemove: (callback) => {
          return interceptorStore.on('afterRemove', callback)
        },
        beforeMove: (callback) => {
          return interceptorStore.on('beforeMove', callback)
        },
        afterMove: (callback) => {
          return interceptorStore.on('afterMove', callback)
        },
      },
    }

    function cleanup() {
      activeIndex.value = -1
      while (visitedRoutes.value.length > 0) {
        visitedRoutes.value.pop()
      }
      interceptorStore.clear()
    }

    onUnmount(() => {
      cleanup()
      delete router.visitedRoutesPlugin
    })

    return {
      onCleanup: cleanup,
    }
  }
}

function isEqualRoute(a: RouteLocationNormalized, b: RouteLocationNormalized) {
  return a.path === b.path
}
