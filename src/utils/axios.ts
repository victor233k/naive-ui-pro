import type { AxiosResponse } from 'axios'
import axios, { AxiosError } from 'axios'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

http.interceptors.response.use((response) => {
  unwrapResponseData(response)
  return response
})

// TODO: 响应错误拦截器必须注册在最后位置，以防止无法捕获到其他拦截器内抛出的错误
// http.interceptors.response.use(null, (error) => Promise.reject(error))

/**
 * 拆解后端数据格式，将真实的数据返回，当出现业务上的错误时会抛出异常
 */
function unwrapResponseData(response: AxiosResponse) {
  const result = {
    error: false,
    data: response.data,
    message: '',
  }

  if (result.data != null) {
    if ('code' in result.data) {
      interface ResponseFormat {
        code: number
        message: string
        data: any
      }

      // TODO: 若有必要可以为 AxiosResponse 扩展 rawData 属性存储原始后端响应的数据格式
      const resultData = result.data as ResponseFormat
      result.error = resultData.code !== 200
      if ('data' in resultData) {
        result.data = resultData.data
      }
      if ('message' in resultData) {
        result.message = resultData.message
      }
    }
  }

  if (result.error) {
    // 抛出正常的 axios 响应错误
    throw new AxiosError(
      result.message || 'Unwrap Error',
      AxiosError.ERR_BAD_RESPONSE,
      response.config,
      response.request,
      response,
    )
  }

  response.data = result.data
}

export default http
