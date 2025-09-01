import type { Router } from 'vue-router'
import { describe, expect, it, vi } from 'vitest'
import { createApp, h } from 'vue'
import { createWebHashHistory, RouterView } from 'vue-router'
import { createRouter } from '../../src/create-router'
import { visitedRoutesPlugin } from '../plugins/visited-routes-plugin'

interface SetupRouterOptions {
  test1Setup?: () => void
  test2Setup?: () => void
  test3Setup?: () => void
  test4Setup?: () => void
  test5Setup?: () => void
}

async function setupRouter(options: SetupRouterOptions = {}) {
  const app = createApp({
    render() {
      return h(RouterView)
    },
  })
  const router = createRouter({
    history: createWebHashHistory(),
    routes: [
      {
        path: '/test1',
        component: {
          setup() {
            options?.test1Setup?.()
          },
          render() {
            return h('div', 'Test1')
          },
        },
      },
      {
        path: '/test2',
        component: {
          setup() {
            options?.test2Setup?.()
          },
          render() {
            return h('div', 'Test2')
          },
        },
      },
      {
        path: '/test3',
        component: {
          setup() {
            options?.test3Setup?.()
          },
          render() {
            return h('div', 'Test3')
          },
        },
      },
      {
        path: '/test4',
        component: {
          setup() {
            options?.test4Setup?.()
          },
          render() {
            return h('div', 'Test4')
          },
        },
      },
      {
        path: '/test5',
        component: {
          setup() {
            options?.test5Setup?.()
          },
          render() {
            return h('div', 'Test5')
          },
        },
      },
    ],
    plugins: [
      visitedRoutesPlugin(),
    ],
  })
  app.use(router)
  await router.isReady()
  app.mount(document.createElement('div'))
  return {
    ...router,
    unmount: () => {
      app.unmount()
      window.location.hash = ''
    },
  }
}

function clearRoutes(router: Router) {
  while (router.visitedRoutesPlugin.routes.length > 0) {
    router.visitedRoutesPlugin.routes.pop()
  }
}

async function restoreRoutes(router: Router) {
  clearRoutes(router)
  await router.push('/test1')
  await router.push('/test2')
  await router.push('/test3')
  await router.push('/test4')
  await router.push('/test5')
  await vi.runAllTimersAsync()
}

describe('visited-routes-plugin', () => {
  vi.useFakeTimers()

  it('routes length', async () => {
    const router = await setupRouter()
    await router.push('/test1')
    await vi.runAllTimersAsync()
    expect(router.visitedRoutesPlugin.routes.length).toBe(1)
    await router.push('/test2')
    await vi.runAllTimersAsync()
    expect(router.visitedRoutesPlugin.routes.length).toBe(2)
    await router.push('/test3')
    await vi.runAllTimersAsync()
    expect(router.visitedRoutesPlugin.routes.length).toBe(3)
    await router.push('/test1')
    await vi.runAllTimersAsync()
    expect(router.visitedRoutesPlugin.routes.length).toBe(3)
    await router.push('/test2')
    await vi.runAllTimersAsync()
    expect(router.visitedRoutesPlugin.routes.length).toBe(3)
    await router.push('/test3')
    await vi.runAllTimersAsync()
    expect(router.visitedRoutesPlugin.routes.length).toBe(3)
    router.unmount()
    expect(router.visitedRoutesPlugin.routes.length).toBe(0)
  })

  it('move routes', async () => {
    const router = await setupRouter()
    await router.push('/test1')
    await router.push('/test2')
    await router.push('/test3')
    await vi.runAllTimersAsync()
    await router.visitedRoutesPlugin.move(0, 2)
    await vi.runAllTimersAsync()
    expect(router.visitedRoutesPlugin.routes[0].path).toBe('/test2')
    expect(router.visitedRoutesPlugin.routes[1].path).toBe('/test3')
    expect(router.visitedRoutesPlugin.routes[2].path).toBe('/test1')
    router.unmount()
  })

  it('remove routes', async () => {
    const router = await setupRouter()
    await router.push('/test1')
    await router.push('/test2')
    await router.push('/test3')
    await vi.runAllTimersAsync()
    await router.visitedRoutesPlugin.remove(1)
    await vi.runAllTimersAsync()
    expect(router.visitedRoutesPlugin.routes.map(item => item.path)).toStrictEqual(['/test1', '/test3'])
    router.unmount()
  })

  it('removes routes', async () => {
    const router = await setupRouter()
    await router.push('/test1')
    await router.push('/test2')
    await router.push('/test3')
    await vi.runAllTimersAsync()
    await router.visitedRoutesPlugin.removes(1, 2)
    await vi.runAllTimersAsync()
    expect(router.visitedRoutesPlugin.routes.map(item => item.path)).toStrictEqual(['/test1', '/test3'])
    await router.visitedRoutesPlugin.removes(0, 2)
    await vi.runAllTimersAsync()
    expect(router.visitedRoutesPlugin.routes.map(item => item.path)).toStrictEqual([])
    router.unmount()
  })

  it('mock close left routes', async () => {
    const router = await setupRouter()
    const activeIndex = router.visitedRoutesPlugin.activeIndex

    await restoreRoutes(router)
    expect(activeIndex.value).toBe(4)
    await router.visitedRoutesPlugin.removes(0, 4)
    await vi.runAllTimersAsync()
    expect(activeIndex.value).toBe(0)
    await router.visitedRoutesPlugin.removes(0, 1)
    await vi.runAllTimersAsync()
    expect(activeIndex.value).toBe(-1)

    await restoreRoutes(router)
    activeIndex.value = 2
    await router.visitedRoutesPlugin.removes(0, 4)
    await vi.runAllTimersAsync()
    expect(router.visitedRoutesPlugin.routes[activeIndex.value].path).toBe('/test5')

    await restoreRoutes(router)
    activeIndex.value = 4
    await router.visitedRoutesPlugin.removes(0, 2)
    await vi.runAllTimersAsync()
    expect(activeIndex.value).toBe(2)

    await restoreRoutes(router)
    await router.visitedRoutesPlugin.remove(4)
    await vi.runAllTimersAsync()
    expect(activeIndex.value).toBe(3)

    await restoreRoutes(router)
    activeIndex.value = 2
    await router.visitedRoutesPlugin.remove(2)
    await vi.runAllTimersAsync()
    expect(activeIndex.value).toBe(2)

    router.unmount()
  })

  it('mock close right routes', async () => {
    const router = await setupRouter()
    const activeIndex = router.visitedRoutesPlugin.activeIndex

    await restoreRoutes(router)
    activeIndex.value = 0
    await router.visitedRoutesPlugin.removes(1, 5)
    await vi.runAllTimersAsync()
    expect(activeIndex.value).toBe(0)

    await restoreRoutes(router)
    activeIndex.value = 1
    await router.visitedRoutesPlugin.removes(2, 5)
    await vi.runAllTimersAsync()
    expect(activeIndex.value).toBe(1)

    await restoreRoutes(router)
    activeIndex.value = 2
    router.visitedRoutesPlugin.removes(1, 5)
    await vi.runAllTimersAsync()
    expect(activeIndex.value).toBe(0)
  })

  it('mock close other', async () => {
    const router = await setupRouter()
    const activeIndex = router.visitedRoutesPlugin.activeIndex

    await restoreRoutes(router)
    activeIndex.value = 2
    await router.visitedRoutesPlugin.removes(0, 2)
    await router.visitedRoutesPlugin.removes(1, 3)
    await vi.runAllTimersAsync()
    expect(activeIndex.value).toBe(0)

    await restoreRoutes(router)
    activeIndex.value = 2
    await router.visitedRoutesPlugin.removes(0, 3)
    await vi.runAllTimersAsync()
    expect(activeIndex.value).toBe(0)
    await router.visitedRoutesPlugin.remove(1)
    await vi.runAllTimersAsync()
    expect(activeIndex.value).toBe(0)

    router.unmount()
  })

  it('mock fixedTabs', async () => {
    const router = await setupRouter()
    const activeIndex = router.visitedRoutesPlugin.activeIndex

    await restoreRoutes(router)
    activeIndex.value = 3
    await router.visitedRoutesPlugin.move(0, 2)
    await vi.runAllTimersAsync()
    expect(activeIndex.value).toBe(3)
    await router.visitedRoutesPlugin.move(3, 4)
    await vi.runAllTimersAsync()
    expect(activeIndex.value).toBe(4)

    await restoreRoutes(router)
    activeIndex.value = 2
    await router.visitedRoutesPlugin.move(3, 4)
    await vi.runAllTimersAsync()
    expect(activeIndex.value).toBe(2)

    await router.visitedRoutesPlugin.move(1, 4)
    await vi.runAllTimersAsync()
    expect(activeIndex.value).toBe(1)
    activeIndex.value = 2
    await router.visitedRoutesPlugin.move(4, 1)
    await vi.runAllTimersAsync()
    expect(activeIndex.value).toBe(3)

    await router.visitedRoutesPlugin.move(0, 3)
    await vi.runAllTimersAsync()
    expect(activeIndex.value).toBe(2)

    activeIndex.value = 2
    await router.visitedRoutesPlugin.move(4, 2)
    await vi.runAllTimersAsync()
    expect(activeIndex.value).toBe(3)

    router.unmount()
  })
})
