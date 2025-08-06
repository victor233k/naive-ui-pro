import type { AxiosInstance, AxiosResponse } from 'axios'
import { AxiosError, isAxiosError } from 'axios'
import { isError, toString } from 'lodash-es'

declare module 'axios' {
  interface AxiosResponse {
    rawData: any
  }
}

export interface SetupResponseInterceptorsOptions {
  unwrapResponseData: (response: AxiosResponse) => any
  handleError: (error: AxiosError) => any
}

export function setupResponseInterceptors(
  http: AxiosInstance,
  options: SetupResponseInterceptorsOptions,
) {
  http.interceptors.response.use((response) => {
    unwrapResponseData(response, options)
    return response
  })

  // 在这里注册错误拦截，确保能捕获所有的错误
  http.interceptors.response.use(null, error => handleError(error, options))
}

function unwrapResponseData(
  response: AxiosResponse,
  options: SetupResponseInterceptorsOptions,
) {
  try {
    response.rawData = response.data
    response.data = options.unwrapResponseData(response)
  }
  catch (e: unknown) {
    throw isAxiosError(e)
      ? e
      : isError(e)
        ? AxiosError.from(
            e,
            AxiosError.ERR_BAD_RESPONSE,
            response.config,
            response.request,
            response,
          )
        : new AxiosError(
          toString(e) || 'Unknown Error',
          AxiosError.ERR_BAD_RESPONSE,
          response.config,
          response.request,
          response,
        )
  }
}

function handleError(error: AxiosError, options: SetupResponseInterceptorsOptions) {
  return options.handleError(error)
}
