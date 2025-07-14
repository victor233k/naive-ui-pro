import { coreRoutes, fallbackNotFoundRoute } from './core'
import {mockRoutes,asyncRoutes} from './modules/list'

const routes = [
  ...coreRoutes,
  fallbackNotFoundRoute,
]

export { asyncRoutes, routes ,mockRoutes}
