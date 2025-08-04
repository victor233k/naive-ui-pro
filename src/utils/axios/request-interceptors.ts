import type { AxiosInstance } from 'axios'

export function setupTokenInterceptor(http: AxiosInstance) {
  http.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })
}
