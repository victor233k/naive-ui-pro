import type { UserInfo, UserLoginPayload } from '../use-user-store'
import http from '@/utils/axios'

export function apiLogin(payload: UserLoginPayload) {
  return http<{ token: string }>({
    url: '/user/login',
    method: 'post',
    data: payload,
  })
}

export function apiQueryUserInfo() {
  return http<Omit<UserInfo, 'token'>>({
    url: '/user/info',
    method: 'get',
  })
}
