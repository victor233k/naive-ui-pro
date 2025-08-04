import axios from 'axios'
import { setupTokenInterceptor } from './request-interceptors'
import { setupErrorInterceptor, setupTransformResponseInterceptor } from './response-interceptors'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

/**
 * 请求前添加 token 的拦截器
 */
setupTokenInterceptor(http)
/**
 * 响应错误拦截器
 */
setupErrorInterceptor(http)
/**
 * 请求后数据格式化拦截器
 */
setupTransformResponseInterceptor(http)

export default http
