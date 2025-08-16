import type { Ref } from 'vue'
import type { RouteLocationNormalized } from 'vue-router'
import type { ProRouterPlugin } from '../plugin'
import { createEventHook, tryOnScopeDispose } from '@vueuse/core'
import { move as _move } from 'pro-naive-ui'
import { ref } from 'vue'

declare module 'vue-router' {
  interface RouteMeta {
    /**
     * 从访问路由记录中排除
     * 如果为 true，则不会添加到访问路由记录中
     * @default false
     */
    visitedRoutesIgnore?: boolean
    /**
     * 是否固定在访问路由记录中
     * 如果为 true，则不会从访问路由记录中删除
     * @default false
     */
    locked?: boolean
  }

  interface Router {
    /**
     * 访问路由记录
     */
    visitedRoutes: VisitedRoutesManager
  }
}

export type InterceptorOffFunction = () => void

export type AddInterceptorResult = RouteLocationNormalized | false | Promise<RouteLocationNormalized | false>

export type AddInterceptor = (visitedRoute: RouteLocationNormalized) => AddInterceptorResult

export interface InterceptorOptions {
  once?: boolean
}

export interface InterceptorResult {
  off: InterceptorOffFunction
}

interface InterceptorRecord<T = any> {
  interceptor: T
  offFn: InterceptorOffFunction
  options: InterceptorOptions
}

/**
 * 拦截器管理器
 */
class InterceptorManager<T = any> {
  private interceptors: InterceptorRecord<T>[] = []

  add(interceptor: T, options: InterceptorOptions = {}): InterceptorResult {
    const record: InterceptorRecord<T> = {
      interceptor,
      offFn: () => {
        const index = this.interceptors.indexOf(record)
        if (index > -1) {
          this.interceptors.splice(index, 1)
        }
      },
      options,
    }
    this.interceptors.push(record)

    // 自动在作用域销毁时清理
    tryOnScopeDispose(record.offFn)

    return { off: record.offFn }
  }

  async execute(...args: any[]): Promise<AddInterceptorResult> {
    let currentResult = args[0]

    for (const record of this.interceptors) {
      try {
        const result = await (record.interceptor as any)(currentResult, ...args.slice(1))
        if (record.options.once) {
          this.interceptors = this.interceptors.filter(item => item.interceptor !== record.interceptor)
        }

        if (result === false) {
          return false
        }

        // 如果拦截器返回了修改后的值，使用它作为下一次执行的输入
        if (result !== undefined && result !== true) {
          currentResult = result
        }
      }
      catch (error) {
        console.error('Interceptor execution failed:', error)
        return false
      }
    }
    return currentResult
  }

  clear() {
    this.interceptors.forEach(record => record.offFn())
    this.interceptors = []
  }

  get size() {
    return this.interceptors.length
  }
}

/**
 * 访问路由记录管理器
 * 提供访问路由的添加、删除、移动、锁定等操作，并自动维护当前激活的访问路由 key
 */
export interface VisitedRoutesManager {
  /**
   * 当前激活的访问路由唯一 key（当前是 fullPath）
   */
  activeKey: Ref<string | null>

  /**
   * 访问路由列表
   */
  routes: Ref<RouteLocationNormalized[]>

  /**
   * 当访问路由成功添加时触发的事件钩子
   */
  onRouteAdded: ReturnType<typeof createEventHook<RouteLocationNormalized>>

  /**
   * 添加访问路由之前的拦截器
   * @param interceptor 拦截器函数
   * @param options 拦截器选项（如 once 表示只执行一次）
   * @returns 用于移除该拦截器的控制对象
   */
  addBeforeAddInterceptor: (interceptor: AddInterceptor, options?: InterceptorOptions) => InterceptorResult

  /**
   * 移除指定索引的访问路由
   * @param index 要移除的索引
   */
  remove: (index: number) => void

  /**
   * 设置当前激活的访问路由 key
   * @param key 要激活的路由 key（通常是 fullPath）
   */
  setActiveKey: (key: string) => void

  /**
   * 移除所有访问路由，仅保留锁定的路由，并确保激活项正确
   */
  removeAllAndEnsureActiveKey: () => void

  /**
   * 在访问路由列表中移动指定索引的路由到另一个位置
   * @param from 原始索引
   * @param to 目标索引
   */
  move: (from: number, to: number) => void

  /**
   * 切换指定索引访问路由的锁定状态
   * @param index 访问路由索引
   */
  toggleVisitedRouteLockedState: (index: number) => void

  /**
   * 根据 fullPath 查找访问路由的索引
   * @param fullPath 完整路径
   * @returns 找到则返回索引，否则返回 -1
   */
  findVisitedRouteIndexByFullPath: (fullPath: string) => number

  /**
   * 移除指定索引的访问路由，并在必要时更新激活项
   * @param index 要移除的索引
   */
  removeAndEnsureActiveKey: (index: number) => void

  /**
   * 添加访问路由
   * @param visitedRoute 要添加的访问路由对象
   * @returns 添加成功返回 true，否则返回 false
   */
  add: (visitedRoute: RouteLocationNormalized) => Promise<boolean>

  /**
   * 移除除指定索引及锁定路由以外的所有访问路由，并确保激活项正确
   * @param index 要保留的索引
   */
  removeOtherAndEnsureActiveKey: (index: number) => void

  /**
   * 移除指定索引之后的所有访问路由，并确保激活项正确
   * @param index 起始索引
   */
  removeAfterAndEnsureActiveKey: (index: number) => void

  /**
   * 移除指定索引之前的所有访问路由，并确保激活项正确
   * @param index 起始索引
   */
  removeBeforeAndEnsureActiveKey: (index: number) => void

  /**
   * 添加访问路由并确保其成为当前激活项
   * @param visitedRoute 要添加的访问路由对象
   * @returns 添加成功返回 true，否则返回 false
   */
  addAndEnsureActiveKey: (visitedRoute: RouteLocationNormalized) => Promise<boolean>

  /**
   * 初始化访问路由列表，并确保当前激活项正确
   * @param routes 可选的初始访问路由数组
   */
  initAndEnsureActiveKey: (routes?: RouteLocationNormalized[]) => Promise<void>
}

export function visitedRoutesPlugin(): ProRouterPlugin {
  return ({ router, onUnmount }) => {
    const routes = ref<RouteLocationNormalized[]>([])
    const activeKey = ref<string | null>(null)

    const beforeAddManager = new InterceptorManager<AddInterceptor>()
    const onRouteAdded = createEventHook<RouteLocationNormalized>()

    const addBeforeAddInterceptor = (interceptor: AddInterceptor, options: InterceptorOptions = {}): InterceptorResult => {
      return beforeAddManager.add(interceptor, options)
    }

    async function add(visitedRoute: RouteLocationNormalized): Promise<boolean> {
      const result = await beforeAddManager.execute(visitedRoute)
      if (result === false) {
        return false
      }
      routes.value.push(result)
      onRouteAdded.trigger(result)
      return true
    }

    function move(from: number, to: number): void {
      if (from < 0 || from >= routes.value.length || to < 0 || to >= routes.value.length) {
        return
      }
      _move(routes.value, from, to)
    }

    function remove(index: number): void {
      if (index < 0 || index >= routes.value.length) {
        return
      }
      routes.value.splice(index, 1)
    }

    function findVisitedRouteIndexByFullPath(fullPath: string) {
      return routes.value.findIndex(visitedRoute => visitedRoute.fullPath === fullPath)
    }

    function setActiveKey(key: string): void {
      if (activeKey.value === key) {
        return
      }
      activeKey.value = key
    }

    async function initAndEnsureActiveKey(routeList?: RouteLocationNormalized[]): Promise<void> {
      if (routeList && routeList.length > 0) {
        routes.value = [...routeList]
        // 等待路由初始化完成，确保 router.currentRoute.value 正确
        await router.isReady()
        const currentRoute = router.currentRoute.value
        if (currentRoute) {
          await addAndEnsureActiveKey(currentRoute)
        }
      }
      else {
        routes.value = []
        activeKey.value = null
      }
    }

    async function addAndEnsureActiveKey(visitedRoute: RouteLocationNormalized): Promise<boolean> {
      const existingIndex = findVisitedRouteIndexByFullPath(visitedRoute.fullPath)
      let addResult = true
      if (existingIndex === -1) {
        addResult = await add(visitedRoute)
      }
      // 只有添加成功且已存在时才设置当前key
      if (addResult || existingIndex !== -1) {
        setActiveKey(visitedRoute.fullPath)
        return true
      }
      return false
    }

    function removeAndEnsureActiveKey(index: number): void {
      const currentVisitedRouteItem = routes.value[index]
      if (!currentVisitedRouteItem || currentVisitedRouteItem.meta?.locked) {
        return
      }
      // todo: 删除最后一个标签页
      if (routes.value.length <= 1) {
        return
      }
      remove(index)
      if (activeKey.value === currentVisitedRouteItem.fullPath) {
        const fallbackIndex = index > 0 ? index - 1 : 0
        const fallbackRoute = routes.value[fallbackIndex]
        if (fallbackRoute) {
          setActiveKey(fallbackRoute.fullPath)
        }
      }
    }

    function removeBeforeAndEnsureActiveKey(index: number) {
      const currentVisitedRouteItem = routes.value[index]
      if (!currentVisitedRouteItem || index <= 0) {
        return
      }
      routes.value = routes.value.filter((visitedRoute, i) => i >= index || visitedRoute.meta?.locked)
      ensureActiveKeyFallback(currentVisitedRouteItem.fullPath)
    }

    function removeAfterAndEnsureActiveKey(index: number) {
      const currentVisitedRouteItem = routes.value[index]
      if (!currentVisitedRouteItem || index >= routes.value.length - 1) {
        return
      }
      routes.value = routes.value.filter((visitedRoute, i) => i <= index || visitedRoute.meta?.locked)
      ensureActiveKeyFallback(currentVisitedRouteItem.fullPath)
    }

    function removeOtherAndEnsureActiveKey(index: number) {
      const currentVisitedRouteItem = routes.value[index]
      if (!currentVisitedRouteItem) {
        return
      }
      routes.value = routes.value.filter((visitedRoute, i) => i === index || visitedRoute.meta?.locked)
      ensureActiveKeyFallback(currentVisitedRouteItem.fullPath)
    }

    function removeAllAndEnsureActiveKey() {
      if (!routes.value.length) {
        return
      }
      const lockedRoutes = routes.value.filter(visitedRoute => visitedRoute.meta?.locked)
      // 回退路由优先锁定路由的最后一个，否则访问路由的第一个
      const fallbackVisitedRoute = lockedRoutes.length > 0
        ? lockedRoutes[lockedRoutes.length - 1]
        : routes.value[0]
      routes.value = lockedRoutes.length > 0
        ? [...lockedRoutes]
        : routes.value.slice(0, 1)
      ensureActiveKeyFallback(fallbackVisitedRoute.fullPath)
    }

    function toggleVisitedRouteLockedState(index: number): void {
      const currentVisitedRouteItem = routes.value[index]
      if (!currentVisitedRouteItem) {
        return
      }
      const newLocked = !currentVisitedRouteItem.meta?.locked
      currentVisitedRouteItem.meta = {
        ...currentVisitedRouteItem.meta,
        locked: newLocked,
      }
    }

    function ensureActiveKeyFallback(currentFullPath: string) {
      if (activeKey.value === currentFullPath) {
        return
      }
      const newIndex = findVisitedRouteIndexByFullPath(currentFullPath)
      if (newIndex !== -1) {
        setActiveKey(currentFullPath)
      }
    }

    const visitedRoutesManager: VisitedRoutesManager = {
      activeKey,
      routes: routes as Ref<RouteLocationNormalized[]>,

      add,
      remove,
      move,
      onRouteAdded,
      addBeforeAddInterceptor,
      setActiveKey,
      toggleVisitedRouteLockedState,
      findVisitedRouteIndexByFullPath,
      addAndEnsureActiveKey,
      initAndEnsureActiveKey,
      removeAndEnsureActiveKey,
      removeAllAndEnsureActiveKey,
      removeAfterAndEnsureActiveKey,
      removeOtherAndEnsureActiveKey,
      removeBeforeAndEnsureActiveKey,
    }

    router.visitedRoutes = visitedRoutesManager

    router.afterEach(async (to) => {
      // 如果路由被标记为忽略，则不添加到访问记录中
      if (to.meta?.visitedRoutesIgnore) {
        return
      }

      await addAndEnsureActiveKey(to as RouteLocationNormalized)
    })

    onUnmount(() => {
      beforeAddManager.clear()

      delete router.visitedRoutes
    })

    return {
      onCleanup: () => {
        routes.value = []
        activeKey.value = null
      },
    }
  }
}
