import type { RouteLocationNormalizedGeneric, RouteRecordNameGeneric, RouteRecordRaw } from 'vue-router'

let uid = 0
const symbol = '__PRO_ROUTER_PLUGIN_AUTO_GENERATED__'

export function generateRouteName() {
  return `${++uid}${symbol}`
}

export function generateRouteComponentName(route: RouteLocationNormalizedGeneric) {
  return `${route.fullPath}${symbol}`
}

export function getRouteComponentName(
  route: RouteLocationNormalizedGeneric,
  namespace: string = 'default',
): string | undefined {
  const currentRoute = route.matched[route.matched.length - 1]
  const currentRouteComponent = currentRoute?.components?.[namespace]
  return (currentRouteComponent as any)?.__name
}

export function ensureRouteName(route: RouteRecordRaw) {
  return route.name
    ? route.name
    : generateRouteName()
}

export function isRouteName(name: any): name is RouteRecordNameGeneric {
  return typeof name === 'string' || typeof name === 'symbol'
}
