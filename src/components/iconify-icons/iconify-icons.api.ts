import http from '@/utils/axios'

interface QueryIconsResponse {
  icons: string[]
}

export class Api {
  static queryIcons(query: string, limit: number) {
    return http<QueryIconsResponse>('/search', {
      baseURL: '/iconify',
      params: {
        query,
        limit,
      },
    })
  }
}
