import type { AxiosInstance, AxiosResponse } from 'axios'
import { get } from 'lodash-es'

declare module 'axios' {
  interface AxiosResponse<T = any, D = any> {
    rawResponse: AxiosResponse<T, D>
  }
}

export function setupTransformResponseInterceptor(http: AxiosInstance) {
  http.interceptors.response.use((response) => {
    if (isSuccess(response)) {
      response.rawResponse = response
      return response.data
    }
    return response
  })
}

export function setupErrorInterceptor(http: AxiosInstance) {
  http.interceptors.response.use(null, (error) => {
    return Promise.reject(error)
  })

  http.interceptors.response.use((response) => {
    if (!isSuccess(response)) {
      return Promise.reject(response)
    }
    return response
  })
}

function isSuccess(response: AxiosResponse) {
  return get(response, 'data.code') === 200
}
