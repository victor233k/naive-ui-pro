import type { FakeRoute } from 'vite-plugin-fake-server'
import type { RoleApi } from '@/api/system/role'
import { defineFakeRoute } from 'vite-plugin-fake-server/client'
import { idFactory } from '../utils'
import { buildCURD } from '../utils/curd'

const curd = buildCURD<RoleApi.Model>('/system/role', idFactory('role-'))
const routes: FakeRoute[] = [...curd.routes]

export default defineFakeRoute(routes)
