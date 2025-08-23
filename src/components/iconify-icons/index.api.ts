import http from '@/utils/axios'

interface QueryIconsResponse {
  icons: string[]
}

export class Api {
  static queryIcons(query: string, limit: number) {
    return http<QueryIconsResponse>('/search', {
      addToken: false,
      baseURL: import.meta.env.VITE_ICONIFY_API_PREFIX_URL,
      params: {
        query,
        limit,
      },
    })
  }
}
