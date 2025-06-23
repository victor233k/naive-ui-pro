import { coreRoutes, fallbackNotFoundRoute } from './core'

const routes = [
  ...coreRoutes,
  fallbackNotFoundRoute,
]

export { routes }
