import http from '@/utils/axios'

interface QueryIconsResponse {
  icons: string[]
}

export class Api {
  static queryIcons(query: string, limit: number) {
    return http<QueryIconsResponse>(`/search?query=${query}&limit=${limit}`, {
      baseURL: '/iconify',
    })
  }
}
