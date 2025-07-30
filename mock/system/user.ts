import type { FakeRoute } from 'vite-plugin-fake-server'
import type { UserApi } from '@/api/system/user'
import { defineFakeRoute } from 'vite-plugin-fake-server/client'
import { idFactory } from '../utils'
import { buildCURD } from '../utils/curd'

const curd = buildCURD<UserApi.Model>('/system/user', idFactory('user-'))
const routes: FakeRoute[] = [...curd.routes]

export default defineFakeRoute(routes)
