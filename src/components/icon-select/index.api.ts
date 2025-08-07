import http from '@/utils/axios'

export class Api {
  static queryIcons(params: Api.queryIcons.RequestData) {
    return http<Api.queryIcons.ResponseData>('/search', {
      baseURL: '/iconify',
      params,
    })
  }
}

export namespace Api {
  export namespace queryIcons {
    export interface RequestData {
      query: string
      limit: number
    }

    export type ResponseData = {
      icons: string[]
    }
  }
}
