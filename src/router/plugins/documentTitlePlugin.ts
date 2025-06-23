import type { MaybeRef, UseTitleOptionsBase } from '@vueuse/core'
import type { NavigationFailure, RouteLocationNormalized } from 'vue-router'
import type { Plugin } from '../composables/create-router'
import { useTitle } from '@vueuse/core'
import { isFunction, isString } from 'lodash-es'

declare module 'vue-router' {
  interface RouteMeta {
    title: string
  }
}
const SYSTEM_DEFAULT = 'Naive-Ui-Pro'

export type TitleTemplate = MaybeRef<string> | ((title: string) => string)

export type TitlePluginOptions = Pick<UseTitleOptionsBase, 'restoreOnUnmount'>
  & {
    /**
     * 是否观察 titleRef 的变化以更新页面标题（与 vueuse 的 useTitle 保持一致）
     * 不能和 titleTemplate 选项一起使用.
     *
     * @default false
     */
    observe?: boolean
  } | {
    /**
     * 页面标题模板
     * 不能和 observe 选项一起使用.
     * @param title 当前页面标题
     * @param ctx 路由上下文
     * @returns 解析后的标题
     *
     * @default '%s - Naive-Ui-Pro' （其中 Naive-Ui-Pro 即 SYSTEM_DEFAULT)
     */
    template?: string | ((title: string, ctx: {
      to: RouteLocationNormalized
      from: RouteLocationNormalized
      failure?: NavigationFailure | void
    }) => string)
  }

type RawTitle = string | ((route: RouteLocationNormalized) => string)

export function documentTitlePlugin(
  options: TitlePluginOptions = {},
): Plugin {
  let template: TitleTemplate
  function resolveTitleOptions(
    title: string,
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    failure?: NavigationFailure | void,
  ) {
    if (!('template' in options)) {
      template = `%s - ${SYSTEM_DEFAULT}`
    }
    else if (isString(options.template)) {
      template = options.template
    }
    else if (isFunction(options.template)) {
      template = options.template(title, {
        to,
        from,
        failure,
      })
    }
    return { ...options, titleTemplate: template }
  }

  function resolveTitle(
    to: RouteLocationNormalized,
  ): string {
    const raw = to.meta.title as RawTitle | undefined
    let title: string
    if (isString(raw)) {
      title = raw
    }
    else {
      if (__DEV__) {
        console.warn(
          `[titlePlugin] 路由 "${to.path}" 缺少 meta.title，已使用默认标题`,
        )
      }
      title = SYSTEM_DEFAULT
    }
    return title
  }

  return {
    name: 'document-title',
    afterEach(to, from, failure) {
      const title = resolveTitle(to)
      const options = resolveTitleOptions(title, to, from, failure)
      useTitle(title, options)
    },
  }
}
